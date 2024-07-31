import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async create(createRentalDto: CreateRentalDto) {
    if (!createRentalDto.title) {
      throw new Error('Title is required to create a rental.');
    }

    const { rental_date, return_date } = createRentalDto;
    const minDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    const maxDuration = 21 * 24 * 60 * 60 * 1000; // 3 weeks in milliseconds

    // * Vérification de la durée de la location.
    console.log(return_date, rental_date);
    console.log(new Date(return_date).getTime());
    console.log(new Date(rental_date).getTime());

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

    const timezone = customer.timezone; // Utiliser UTC par défaut si le fuseau horaire n'est pas défini

    const rentalDateTime = DateTime.fromISO(rental_date).setZone(timezone);
    const returnDateTime = return_date
      ? DateTime.fromISO(return_date).setZone(timezone)
      : null;

    // Chercher l'inventaire associé au film
    const inventory = await this.prisma.inventory.findFirst({
      where: { film_id: movie.film_id },
    });
    if (!inventory) {
      throw new Error('Inventory not found for the given movie.');
    }

    // Créer l'entrée dans rental
    return await this.prisma.rental.create({
      data: {
        rental_date: rentalDateTime,
        inventory: { connect: { inventory_id: inventory.inventory_id } }, // Connexion avec un enregistrement existant dans la table `inventory`
        customer: { connect: { customer_id: createRentalDto.customer_id } }, // Connexion avec un enregistrement existant dans la table `customer`
        return_date: returnDateTime,
        staff: { connect: { staff_id: createRentalDto.staff_id } }, // Connexion avec un enregistrement existant dans la table `staff`
      },
    });
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
}
