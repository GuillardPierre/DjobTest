import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { RentalService } from '../rental/rental.service';

@Injectable()
export class ScheduledTaskService {
  constructor(private readonly rentalService: RentalService) {}

  // ! Au début je souhaitais utiliser ce code pour vérifier toutes les heures s'il y avait une nouvelle location qui se termine dans 5 ou 3 jours. Mais cela faisait beaucoup de requêtes inutiles au serveur.

  // @Cron(CronExpression.EVERY_12_HOURS)
  // async handleCron() {
  //   console.log('test');

  //   const now = DateTime.now().startOf('hour');
  //   const fiveDaysFromNow = now.plus({ days: 5 }).startOf('day');
  //   const threeDaysFromNow = now.plus({ days: 3 }).startOf('day');
  //   // Récupérer les locations dont la `return_date` est dans 5 jours ou 3 jours
  //   const rentals = await this.rentalService.findRentalsNearReturnDate(
  //     fiveDaysFromNow,
  //     threeDaysFromNow,
  //   );
  //   console.log('verification en cours !', rentals);
  //   rentals.forEach((rental) => {
  //     const returnDate = DateTime.fromJSDate(rental.return_date);
  //     const reminderTime = returnDate
  //       .minus({ days: 5 })
  //       .set({ hour: 12, minute: 0, second: 0 });
  //     if (now >= reminderTime && now < reminderTime.plus({ minutes: 60 })) {
  //       console.log('email envoyé');
  //     }
  //     const reminderTimeThreeDays = returnDate
  //       .minus({ days: 3 })
  //       .set({ hour: 12, minute: 0, second: 0 });
  //     if (
  //       now >= reminderTimeThreeDays &&
  //       now < reminderTimeThreeDays.plus({ minutes: 60 })
  //     ) {
  //       console.log('email envoyé');
  //     }
  //   });
  // }
}
