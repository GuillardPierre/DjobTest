import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from 'src/modules/prisma/prisma.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService],
})
export class CustomerModule {}
