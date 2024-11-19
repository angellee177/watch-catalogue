import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        type: String,
        required: false,
      })
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      name?: string;
    
      @ApiProperty({
        description: 'The email of the user',
        type: String,
        required: false,
      })
      @IsEmail()
      @IsOptional()
      email?: string;
    
      @ApiProperty({
        description: 'The password of the user',
        type: String,
        required: false,
      })
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      password?: string;
}
