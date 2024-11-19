import { ApiProperty } from '@nestjs/swagger';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn, 
} from 'typeorm';

@Entity()
export class User {
    @ApiProperty({ description: 'Unique identifier of the user', example: '1f4e9a57-8d2f-4b26-91ab-3bfa1b2c51df' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    @Column()
    name: string;
  
    @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
    @Column()
    email: string;

    @ApiProperty({ description: 'Password of the user that have ben encrypt' })
    @Column()
    password?: string;
  
    @ApiProperty({ description: 'Timestamp when the user was created' })
    @CreateDateColumn()
    createdAt: Date;
  
    @ApiProperty({ description: 'Timestamp when the user was last updated' })
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ApiProperty({ description: 'Timestamp when the user was deleted (if soft deleted)', nullable: true })
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date; // tracks when the entity was soft deleted
}