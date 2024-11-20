import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt, IsDate } from 'class-validator';

export class UpdateWatchDto {
  @ApiPropertyOptional({
    description: 'Name of the watch (cannot be updated)',
    type: String,
    example: 'Rolex Submariner',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique reference number of the watch (optional)',
    type: String,
    example: '12345-ABCDE',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Retail price of the watch (optional)',
    type: Number,
    example: 1000000,
  })
  @IsOptional()
  @IsInt()
  retailPrice?: number;

  @ApiPropertyOptional({
    description: 'Currency ID associated with the retail price (optional)',
    type: String,
    example: 'USD',
  })
  @IsOptional()
  @IsUUID()
  currencyId?: string;

  @ApiPropertyOptional({
    description: 'Release date of the watch (optional)',
    type: String,
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDate()
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Country ID associated with the watch (optional)',
    type: String,
    example: 'US',
  })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Brand ID associated with the watch (optional)',
    type: String,
    example: 'Rolex',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;
}
