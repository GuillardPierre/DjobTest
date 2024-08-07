import { Injectable, Logger } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PrismaService } from '../prisma/prisma.module';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { DateTime } from 'luxon';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);
  constructor(
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async initializeReminders() {
    const reminders = await this.prisma.reminder.findMany({
      where: { notification_sended: false },
      include: {
        rental: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!reminders.length) {
      console.log('Aucune notification à envoyer');
    } else {
      console.log(`${reminders.length} notification(s) à prévoir`);
    }

    reminders.forEach((reminder) => {
      console.log(
        // 'voici un reminder',
        // reminder,
        'date de notification:',
        DateTime.fromJSDate(reminder.notification_date).setZone(
          reminder.rental.customer.timezone,
        ),
      );

      const notificationTimeOut = setTimeout(
        async () => {
          this.logger.log(`Envoie du mail de rappel 5 jours  à l'utilisateur`);
          const updatedReminder = await this.prisma.reminder.update({
            where: { reminder_id: reminder.reminder_id },
            data: {
              notification_sended: true,
            },
          });
          console.log('updateReminder', updatedReminder);
        },
        DateTime.fromJSDate(reminder.notification_date)
          .setZone(reminder.rental.customer.timezone)
          .toMillis() - DateTime.now().toMillis(),
      );
      this.schedulerRegistry.addTimeout(
        `reminder_id : ${reminder.reminder_id} rental : ${reminder.rental_id} reminder date : ${reminder.notification_date} `,
        notificationTimeOut,
      );
    });
  }

  async getAll() {
    const allReminders = this.prisma.reminder.findMany();

    return allReminders;
  }

  async sendNotification(reminder_id: number) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { notification_sended: false, reminder_id: reminder_id },
      include: {
        rental: {
          include: {
            customer: true,
          },
        },
      },
    });

    console.log(
      `Email envoyé à ${reminder.rental.customer.email} pour prévenir de la date de retour au ${reminder.rental.return_date}`,
    );

    const updatedReminder = await this.prisma.reminder.update({
      where: { reminder_id: reminder.reminder_id },
      data: {
        notification_sended: true,
      },
    });
  }
}
