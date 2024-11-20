import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from '../../brands/entity/brand.entity';
import { Currency } from '../../currencies/entity/currency.entity';
import { Country } from '../../countries/entity/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('watch')
export class Watch {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the watch', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the watch' })
  name: string;

  @ManyToOne(() => Brand, { nullable: true })
  @JoinColumn({ name: 'brand' })
  @ApiProperty({ description: 'Brand associated with the watch', type: () => Brand, nullable: true })
  brand: Brand;

  @Column({ unique: true })
  @ApiProperty({ description: 'Unique reference number for the watch' })
  referenceNumber: string;

  @Column('bigint')
  @ApiProperty({ description: 'Retail price of the watch in the specified currency' })
  retailPrice: number;

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn({ name: 'currency' })
  @ApiProperty({ description: 'Currency associated with the retail price', type: () => Currency, nullable: true })
  currency: Currency;

  @Column('date')
  @ApiProperty({ description: 'Release date of the watch' })
  releaseDate: string;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country' })
  @ApiProperty({ description: 'Country associated with the watch', type: () => Country, nullable: true })
  country: Country;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the watch was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the watch was last updated' })
  updatedAt: Date;
}