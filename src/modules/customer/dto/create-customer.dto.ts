export class CreateCustomerDto {
  // On crée un validateur (dto = data transfer schemas) qui va définir la forme attendu par le serveur pour créer un customer
  timezone: string;
  store_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  address_id: number;
  activebool: boolean;
  active: number;
  address?: {
    address: string;
    address2?: string;
    district: string;
    city_id: number;
    postal_code?: string;
    phone: string;
  };
}
