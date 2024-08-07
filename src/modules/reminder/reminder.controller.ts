import { Controller, Get, Param } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  findAll() {
    return this.reminderService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.reminderService.sendNotification(+id);
  }
}
