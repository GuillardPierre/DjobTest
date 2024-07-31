import { Controller } from '@nestjs/common';
import { ScheduledTaskService } from './scheduled-task.service';

@Controller('scheduled-task')
export class ScheduledTaskController {
  constructor(private readonly scheduledTaskService: ScheduledTaskService) {}
}
