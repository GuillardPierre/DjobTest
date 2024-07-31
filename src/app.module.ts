import { Module } from '@nestjs/common';
import { CustomerModule } from './modules/customer/customer.module';
import { PrismaService } from './modules/prisma/prisma.module';
import { FilmModule } from './modules/film/film.module';
import { RentalModule } from './modules/rental/rental.module';
import { ScheduledTaskModule } from './modules/scheduled-task/scheduled-task.module';

@Module({
  imports: [CustomerModule, FilmModule, RentalModule, ScheduledTaskModule],
  providers: [PrismaService],
})
export class AppModule {}
