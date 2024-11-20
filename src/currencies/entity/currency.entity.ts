import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Country } from '../../countries/entity/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('currency')
export class Currency {
  @ApiProperty({
    description: 'The unique identifier of the currency',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the currency',
    type: String,
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'The unique code of the currency (e.g. USD, EUR)',
    type: String,
    maxLength: 10,
  })
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @ApiProperty({
    description: 'The country associated with the currency',
    type: () => Country,  // NestJS Swagger will resolve Country type
    nullable: true,
  })
  // using bidirecitonal relationship
  @OneToOne(() => Country, (country) => country.currencies, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @ApiProperty({
    description: 'The symbol of the currency (e.g. $, €)',
    type: String,
    nullable: true,
    maxLength: 10,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  symbol: string;

  @ApiProperty({
    description: 'The timestamp when the currency record was created',
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the currency record was last updated',
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
