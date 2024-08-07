import { Injectable, Logger } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { BadRequestException } from '@nestjs/common';
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
    // Chercher le film par titre
    const movie = await this.prisma.film.findFirst({
      where: { title: createRentalDto.title },
    });
    if (!movie) {
      throw new Error('Movie not found.');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { customer_id: createRentalDto.customer_id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // On récupère la timezone enregistré auprès de l'utilisateur
    const timezone = customer.timezone;

    // On enregistre la date d'emprunt avec le timezone de l'utilisateur
    const rentalDateTime = DateTime.fromISO(rental_date).setZone(timezone);
    // Même chose pour la date de retour
    const returnDateTime = return_date
      ? DateTime.fromISO(return_date).setZone(timezone)
      : null;

    // Chercher l'id de l'inventaire associé au film afin de l'enregistrer dans le rental
    const inventory = await this.prisma.inventory.findFirst({
      where: { film_id: movie.film_id },
    });
    if (!inventory) {
      throw new Error('Inventory not found for the given movie.');
    }

    // Créer l'entrée dans rental
    const rental = await this.prisma.rental.create({
      data: {
        rental_date: rentalDateTime.toISO(),
        inventory: { connect: { inventory_id: inventory.inventory_id } }, // Connexion avec un enregistrement existant dans la table `inventory`
        customer: { connect: { customer_id: createRentalDto.customer_id } }, // Connexion avec un enregistrement existant dans la table `customer`
        return_date: returnDateTime.toISO(),
        staff: { connect: { staff_id: createRentalDto.staff_id } }, // Connexion avec un enregistrement existant dans la table `staff`
      },
    });

    console.log(rental.rental_date);

    // Programmer les notifications en appelant la fonction associée
    this.scheduleNotifications(rental, customer.customer_id);

    return rental;
  }

  async scheduleNotifications(rental: rental, customerId: number) {
    const threeDaysBefore = DateTime.fromJSDate(rental.return_date)
      .minus({ days: 3 })
      .set({ hour: 12, minute: 0, second: 0 });
    const fiveDaysBefore = DateTime.fromJSDate(rental.return_date)
      .minus({ days: 5 })
      .set({ hour: 12, minute: 0, second: 0 });
    console.log('Date 3 jours avant', threeDaysBefore);
    console.log('Date 5 jours avant', fiveDaysBefore);

    const reminderFiveDays = await this.prisma.reminder.create({
      data: {
        rental_id: rental.rental_id,
        notification_date: fiveDaysBefore.toISO(),
        notification_sended: false,
      },
    });
    console.log('reminder 5 jours', reminderFiveDays);

    const reminderThreeDay = await this.prisma.reminder.create({
      data: {
        rental_id: rental.rental_id,
        notification_date: threeDaysBefore.toISO(),
        notification_sended: false,
      },
    });

    // ! Le reminder est bien à 12h pour l'utilisateur malgré l'info contenue dans le console.log.
    console.log('reminder 3 jours', reminderThreeDay);

    const threeDaysTimeout = setTimeout(async () => {
      this.logger.log(
        `Envoie du mail de rappel 3 jours à l'utilisateur : ${customerId}`,
      );
      const updatedReminder = await this.prisma.reminder.update({
        where: { reminder_id: reminderThreeDay.reminder_id },
        data: {
          notification_sended: true,
        },
      });
      console.log('updateReminder', updatedReminder);
      reminderThreeDay;
    }, threeDaysBefore.toMillis() - DateTime.now().toMillis());

    const fiveDaysTimeout = setTimeout(async () => {
      this.logger.log(
        `Envoie du mail de rappel 5 jours  à l'utilisateur : ${customerId}`,
      );
      const updatedReminder = await this.prisma.reminder.update({
        where: { reminder_id: reminderFiveDays.reminder_id },
        data: {
          notification_sended: true,
        },
      });
      console.log('updateReminder', updatedReminder);
    }, fiveDaysBefore.toMillis() - DateTime.now().toMillis());

    this.schedulerRegistry.addTimeout(
      `${customerId}_three_days`,
      threeDaysTimeout,
    );
    this.schedulerRegistry.addTimeout(
      `${customerId}_five_days`,
      fiveDaysTimeout,
    );
  }

  async findAll() {
    return await this.prisma.rental.findMany();
  }

  async findOne(rental_id: number) {
    return await this.prisma.rental.findUnique({
      where: { rental_id },
    });
  }

  update(rental_id: number, data: UpdateRentalDto) {
    const updateData: any = {
      ...data,
      last_update: new Date(),
    };

    return this.prisma.rental.update({
      where: { rental_id },
      data: updateData,
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
