import { DateTime } from 'luxon';

export type rentalResult = {
  rental_id: number;
  rental_date: Date;
  inventory_id: number;
  customer_id: number;
  return_date: DateTime;
  staff_id: number;
  last_update: Date;
};
