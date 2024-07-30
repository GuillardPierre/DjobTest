import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './modules/prisma/prisma.module';
import { FilmModule } from './film/film.module';

@Module({
  imports: [CustomerModule, FilmModule],
  providers: [PrismaService],
})
export class AppModule {}
