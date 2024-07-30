import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './modules/prisma/prisma.module';
import { FilmModule } from './film/film.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [CustomerModule, FilmModule, RentalModule],
  providers: [PrismaService],
})
export class AppModule {}
