import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entity/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('brand')
export class Brand {
    @ApiProperty({
        description: 'The unique identifier of the brand',
        type: String,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The name of the brand',
        type: String,
        maxLength: 255,
    })
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @ApiProperty({
        description: 'The country of origin associated with the brand',
        type: () => Country,
        nullable: true,
    })
    @ManyToOne(() => Country, (country) => country.brands, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'countryId' })
    originCountry: Country;

    @ApiProperty({
        description: 'The timestamp when the brand record was created',
        type: String,
        example: '2024-01-01T00:00:00.000Z',
    })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({
        description: 'The timestamp when the brand record was last updated',
        type: String,
        example: '2024-01-01T00:00:00.000Z',
    })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({
        description: 'The timestamp when the brand record was deleted',
        type: String,
        nullable: true,
        example: '2024-01-01T00:00:00.000Z',
    })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
