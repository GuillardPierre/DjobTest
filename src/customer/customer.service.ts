import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDto) {
    console.log('je suis ici');

    // ! Pour l'instant on peut créer un utilisateur avec un id d'adresse. Il faudrait gérer l'adresse avec une autre ressource.
    return this.prisma.customer.create({
      data: {
        store: { connect: { store_id: data.store_id } }, // Connexion avec un enregistrement existant dans la table `store`
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        address: { connect: { address_id: data.address_id } }, // Connexion avec un enregistrement existant dans la table `address`
        activebool: data.activebool,
        active: data.active,
        create_date: new Date(), // Valeur par défaut, si nécessaire
        last_update: new Date(), // Valeur par défaut, si nécessaire
      },
    });
  }

  async findAll() {
    return this.prisma.customer.findMany();
  }

  async findOne(customer_id: number) {
    return this.prisma.customer.findUnique({
      where: { customer_id },
    });
  }

  // ! Pour l'instant on peut modifier un utilisateur avec un id d'adresse. Il faudrait gérer l'adresse avec une autre ressource.
  async update(
    customer_id: number,
    data: UpdateCustomerDto,
    address_id?: number,
  ) {
    const updateData: any = {
      ...data,
      last_update: new Date(),
    };

    if (address_id) {
      updateData.address = { connect: { address_id } };
    }

    return this.prisma.customer.update({
      where: { customer_id },
      data: updateData,
    });
  }

  async remove(customer_id: number) {
    return this.prisma.customer.delete({ where: { customer_id } });
  }
}
