import { Module, OnModuleInit } from '@nestjs/common';
import { CustomerModule } from './modules/customer/customer.module';
import { PrismaService } from './modules/prisma/prisma.module';
import { FilmModule } from './modules/film/film.module';
import { RentalModule } from './modules/rental/rental.module';
import { ScheduledTaskModule } from './modules/scheduled-task/scheduled-task.module';
import { ReminderService } from './modules/reminder/reminder.service';
import { ReminderModule } from './modules/reminder/reminder.module';

@Module({
  imports: [
    CustomerModule,
    FilmModule,
    RentalModule,
    ScheduledTaskModule,
    ReminderModule,
  ],
  providers: [PrismaService, ReminderService],
})
export class AppModule implements OnModuleInit {
  constructor(private reminderService: ReminderService) {}

  async onModuleInit() {
    await this.reminderService.initializeReminders();
  }
}
