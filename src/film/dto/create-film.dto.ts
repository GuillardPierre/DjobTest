import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsDecimal,
  IsDate,
  IsEnum,
} from 'class-validator';

enum MpaaRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
}

export class CreateFilmDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  release_year?: number;

  @IsInt()
  language_id: number;

  @IsOptional()
  @IsInt()
  original_language_id?: number;

  @IsInt()
  rental_duration: number;

  @IsDecimal()
  rental_rate: number;

  @IsOptional()
  @IsInt()
  length?: number;

  @IsDecimal()
  replacement_cost: number;

  @IsOptional()
  @IsEnum(MpaaRating)
  rating?: MpaaRating;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  special_features?: string[];
}
