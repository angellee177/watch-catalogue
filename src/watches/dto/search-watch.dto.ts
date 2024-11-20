import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWatchDto {
  @ApiProperty({
    description: 'The name of the watch',
    required: false,
    example: 'Santos de Cartier',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The brand of the watch',
    example: 'Cartier',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'The country where the watch is manufactured',
    example: 'American Samoa',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'The maximum price for the watch',
    example: '10000',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiProperty({
    description: 'The minimum price for the watch',
    example: '0',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiProperty({
    description: 'The reference number of the watch',
    name: 'WSSA0029',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({
    description: 'The page number for pagination',
    required: false,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items per page for pagination',
    required: false,
    type: Number,
    default: 25,
  })
  @IsOptional()
  @IsInt()
  limit?: number = 25;
}
