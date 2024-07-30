import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { log } from 'console';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async create(createRentalDto: CreateRentalDto) {
    if (!createRentalDto.title) {
      throw new Error('Title is required to create a rental.');
    }

    // Chercher le film par titre
    const movie = await this.prisma.film.findFirst({
      where: { title: createRentalDto.title },
    });
    if (!movie) {
      throw new Error('Movie not found.');
    }

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
        rental_date: createRentalDto.rental_date,
        inventory: { connect: { inventory_id: inventory.inventory_id } }, // Connexion avec un enregistrement existant dans la table `inventory`
        customer: { connect: { customer_id: createRentalDto.customer_id } }, // Connexion avec un enregistrement existant dans la table `customer`
        return_date: createRentalDto.return_date,
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
