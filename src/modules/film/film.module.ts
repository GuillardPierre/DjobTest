import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { PrismaService } from 'src/modules/prisma/prisma.module';

@Module({
  controllers: [FilmController],
  providers: [FilmService, PrismaService],
})
export class FilmModule {}
