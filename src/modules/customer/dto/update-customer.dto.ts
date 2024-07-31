import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

// export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class UpdateCustomerDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  activebool?: boolean;
  active?: number;
}
