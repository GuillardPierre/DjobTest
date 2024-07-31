import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.module';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmService {
  constructor(private prisma: PrismaService) {}

  // ! TODO Bug sur la création de film à investiguer
  // async create(createFilmDto: CreateFilmDto) {
  //   return this.prisma.film.create({
  //     data: createFilmDto,
  //   });
  // }

  async findAll() {
    return this.prisma.film.findMany();
  }

  async findOne(film_id: number) {
    return this.prisma.film.findUnique({
      where: { film_id },
    });
  }

  async update(film_id: number, data: UpdateFilmDto) {
    const updateData: any = {
      ...data,
      last_update: new Date(),
    };

    return this.prisma.film.update({
      where: { film_id },
      data: updateData,
    });
  }

  async remove(film_id: number) {
    return this.prisma.film.delete({ where: { film_id } });
  }
}
