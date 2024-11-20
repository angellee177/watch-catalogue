// create-brand.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({
        description: 'The name of the brand',
        type: String,
        maxLength: 255,
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The country of origin associated with the brand',
        type: String,
        required: true,
    })
    @IsUUID()
    originCountryId: string;
}
