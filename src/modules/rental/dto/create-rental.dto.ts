import { IsInt, IsOptional, IsDate, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsDate()
  rental_date: string;

  @IsInt()
  inventory_id: number;

  @IsInt()
  customer_id: number;

  @IsOptional()
  @IsDate()
  return_date: string;

  @IsInt()
  staff_id: number;

  @IsString()
  title: string; // Ajoutez cette ligne
}
