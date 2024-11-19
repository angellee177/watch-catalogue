import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'The name of the currency',
    example: 'USD',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The code of the currency',
    example: 'USD',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The ID of the country where the currency is used',
    example: 'fdd72c5e-11db-4f94-b54d-7b70c2fa12cd',
  })
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'The symbol of the currency (optional)',
    example: '$',
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol?: string;
}
