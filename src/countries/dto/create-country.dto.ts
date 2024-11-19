import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
    @ApiProperty({
        description: 'Country name',
        example: 'Singapore',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Country code',
        example: 'SG', 
    })
    @IsNotEmpty()
    @IsString()
    code: string;
}
