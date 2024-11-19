import { ApiProperty } from '@nestjs/swagger';

export class UserResultDto {
    @ApiProperty({ description: 'Unique identifier of the user', example: '1f4e9a57-8d2f-4b26-91ab-3bfa1b2c51df' })
    id: string;

    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    name: string;

    @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
    email: string;
}
