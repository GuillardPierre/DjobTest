import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { RentalService } from '../rental/rental.service';

@Injectable()
export class ScheduledTaskService {
  constructor(private readonly rentalService: RentalService) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    console.log('test');

    const now = DateTime.now().startOf('hour');
    const fiveDaysFromNow = now.plus({ days: 5 }).startOf('day');
    const threeDaysFromNow = now.plus({ days: 3 }).startOf('day');
    // Récupérer les locations dont la `return_date` est dans 5 jours ou 3 jours
    const rentals = await this.rentalService.findRentalsNearReturnDate(
      fiveDaysFromNow,
      threeDaysFromNow,
    );
    console.log('verification en cours !', rentals);
    rentals.forEach((rental) => {
      const returnDate = DateTime.fromJSDate(rental.return_date);
      const reminderTime = returnDate
        .minus({ days: 5 })
        .set({ hour: 12, minute: 0, second: 0 });
      if (now >= reminderTime && now < reminderTime.plus({ minutes: 60 })) {
        console.log('email envoyé');
      }
      const reminderTimeThreeDays = returnDate
        .minus({ days: 3 })
        .set({ hour: 12, minute: 0, second: 0 });
      if (
        now >= reminderTimeThreeDays &&
        now < reminderTimeThreeDays.plus({ minutes: 60 })
      ) {
        console.log('email envoyé');
      }
    });
  }
}
