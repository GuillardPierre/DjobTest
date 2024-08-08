import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { DateTime } from 'luxon';
import { SchedulerRegistry } from '@nestjs/schedule';
import { rental } from '@prisma/client';

@Injectable()
export class RentalService {
  private readonly logger = new Logger(RentalService.name);

  constructor(
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(createRentalDto: CreateRentalDto) {
    try {
      this.validateCreateRentalDto(createRentalDto);

      const { rental_date, return_date, inventory_id, customer_id } =
        createRentalDto;

      // Vérifiez s'il existe déjà une location avec les mêmes paramètres
      await this.checkForDuplicateRental(
        rental_date,
        inventory_id,
        customer_id,
      );

      const movie = await this.findMovieByTitle(createRentalDto.title);
      const customer = await this.findCustomerById(customer_id);

      const rentalDateTime = this.convertToCustomerTimezone(
        rental_date,
        customer.timezone,
      );
      const returnDateTime = this.convertToCustomerTimezone(
        return_date,
        customer.timezone,
      );

      const inventory = await this.findInventoryByFilmId(movie.film_id);
      const rental = await this.createRentalRecord(
        createRentalDto,
        rentalDateTime,
        returnDateTime,
        inventory.inventory_id,
      );

      this.scheduleNotifications(rental, customer.customer_id);

      return rental;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new Error(
        'An unexpected error occurred during the rental creation.',
      );
    }
  }

  private validateCreateRentalDto(createRentalDto: CreateRentalDto) {
    if (!createRentalDto.title) {
      throw new Error('Title is required to create a rental.');
    }

    const { rental_date, return_date } = createRentalDto;
    const minDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    const maxDuration = 21 * 24 * 60 * 60 * 1000; // 3 weeks in milliseconds

    if (
      !return_date ||
      new Date(return_date).getTime() - new Date(rental_date).getTime() <
        minDuration ||
      new Date(return_date).getTime() - new Date(rental_date).getTime() >
        maxDuration
    ) {
      throw new BadRequestException(
        'Rental duration must be between 1 and 3 weeks.',
      );
    }
  }

  private async checkForDuplicateRental(
    rental_date: string,
    inventory_id: number,
    customer_id: number,
  ) {
    const existingRental = await this.prisma.rental.findFirst({
      where: {
        rental_date,
        inventory_id,
        customer_id,
      },
    });

    if (existingRental) {
      throw new BadRequestException(
        'A rental with the same rental date, inventory, and customer already exists.',
      );
    }
  }

  private async findMovieByTitle(title: string) {
    const movie = await this.prisma.film.findFirst({ where: { title } });
    if (!movie) {
      throw new BadRequestException('Movie not found.');
    }
    return movie;
  }

  private async findCustomerById(customer_id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { customer_id },
    });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return customer;
  }

  private convertToCustomerTimezone(date: string, timezone: string) {
    return DateTime.fromISO(date).setZone(timezone);
  }

  private async findInventoryByFilmId(film_id: number) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { film_id },
    });
    if (!inventory) {
      throw new BadRequestException('Inventory not found for the given movie.');
    }
    return inventory;
  }

  private async createRentalRecord(
    createRentalDto: CreateRentalDto,
    rentalDateTime: DateTime,
    returnDateTime: DateTime,
    inventory_id: number,
  ) {
    return this.prisma.rental.create({
      data: {
        rental_date: rentalDateTime.toISO(),
        inventory: { connect: { inventory_id } },
        customer: { connect: { customer_id: createRentalDto.customer_id } },
        return_date: returnDateTime.toISO(),
        staff: { connect: { staff_id: createRentalDto.staff_id } },
      },
    });
  }

  async scheduleNotifications(rental: rental, customerId: number) {
    const threeDaysBefore = this.calculateReminderDate(rental.return_date, 3);
    const fiveDaysBefore = this.calculateReminderDate(rental.return_date, 5);

    const reminderFiveDays = await this.createReminder(
      rental.rental_id,
      fiveDaysBefore,
    );
    const reminderThreeDays = await this.createReminder(
      rental.rental_id,
      threeDaysBefore,
    );

    this.setupTimeout(
      threeDaysBefore,
      customerId,
      reminderThreeDays.reminder_id,
      3,
    );
    this.setupTimeout(
      fiveDaysBefore,
      customerId,
      reminderFiveDays.reminder_id,
      5,
    );
  }

  private async createReminder(rental_id: number, notification_date: DateTime) {
    return this.prisma.reminder.create({
      data: {
        rental_id,
        notification_date: notification_date.toISO(),
        notification_sended: false,
      },
    });
  }

  private setupTimeout(
    notificationDate: DateTime,
    customerId: number,
    reminderId: number,
    daysBefore: number,
  ) {
    const timeout = setTimeout(async () => {
      this.logger.log(
        `Sending ${daysBefore} days reminder to customer ${customerId}`,
      );
      await this.updateReminder(reminderId);
    }, notificationDate.toMillis() - DateTime.now().toMillis());

    this.schedulerRegistry.addTimeout(
      `reminder_id:${reminderId}${customerId}_${daysBefore}_days`,
      timeout,
    );
  }

  private calculateReminderDate(returnDate: Date, daysBefore: number) {
    return DateTime.fromJSDate(returnDate)
      .minus({ days: daysBefore })
      .set({ hour: 12, minute: 0, second: 0 });
  }

  private async updateReminder(reminderId: number) {
    await this.prisma.reminder.update({
      where: { reminder_id: reminderId },
      data: { notification_sended: true },
    });
  }

  async findAll() {
    return await this.prisma.rental.findMany();
  }

  async findOne(rental_id: number) {
    return await this.prisma.rental.findUnique({ where: { rental_id } });
  }

  async update(rental_id: number, data: UpdateRentalDto) {
    // Fetch the rental to check the current status
    const rental = await this.prisma.rental.findUnique({
      where: { rental_id },
    });

    if (!rental) {
      throw new BadRequestException('Rental not found.');
    }

    // Check if the rental is currently ongoing
    const now = new Date();
    if (now >= rental.rental_date && now <= rental.return_date) {
      throw new BadRequestException(
        'Cannot modify a rental that is currently ongoing.',
      );
    }

    // Proceed with the update if the rental is not ongoing
    return this.prisma.rental.update({
      where: { rental_id },
      data: {
        ...data,
        last_update: new Date(),
      },
    });
  }

  async remove(rental_id: number) {
    return await this.prisma.rental.delete({ where: { rental_id } });
  }

  async findRentalsNearReturnDate(
    fiveDaysFromNow: DateTime,
    threeDaysFromNow: DateTime,
  ) {
    return this.prisma.rental.findMany({
      where: {
        return_date: {
          gte: fiveDaysFromNow.toJSDate(),
          lte: threeDaysFromNow.toJSDate(),
        },
      },
    });
  }
}
