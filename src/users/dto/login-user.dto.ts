import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'jane.doe@example.com',  // Example value for email
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'securepassword2',  // Example value for password
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
  