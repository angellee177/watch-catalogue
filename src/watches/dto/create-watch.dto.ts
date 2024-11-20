import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateWatchDto {
  @ApiProperty({
    description: 'The name of the watch',
    type: String,
    example: 'Rolex Submariner',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique reference number of the watch',
    type: String,
    example: 'ROLEX12345',
  })
  @IsNotEmpty()
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    description: 'Retail price of the watch',
    type: Number,
    example: 10000,
  })
  @IsNotEmpty()
  @IsInt()
  retailPrice: number;

  @ApiProperty({
    description: 'Currency ID associated with the retail price',
    type: String,
    example: 'USD',
  })
  @IsNotEmpty()
  @IsUUID()
  currencyId: string;

  @ApiProperty({
    description: 'Release date of the watch',
    type: String,
    example: '2023-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;

  @ApiProperty({
    description: 'Country ID associated with the watch (optional)',
    type: String,
    example: 'US',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'Brand ID associated with the watch (optional)',
    type: String,
    example: 'ROLEX',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  brandId: string;
}
