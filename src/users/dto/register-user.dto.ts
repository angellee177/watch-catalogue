import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',  // Example value for name
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'angel@test.com',  // Example value for email
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'P@ssw0rd123',  // Example value for password
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    password?: string;
}
  