import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateBrandDto {
    @ApiProperty({
        description: 'The name of the brand',
        type: String,
        maxLength: 255,
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'The country of origin associated with the brand',
        type: String,
        required: false,
    })
    @IsUUID()
    @IsOptional()
    originCountryId?: string; // Optionally update the country of origin
}
