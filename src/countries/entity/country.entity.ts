import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "currency/entity/currency.entity";

@Entity("country")
export class Country {
    @ApiProperty({
        description: "Unique identifier of the country",
        example: "d512e39a-b448-4eb5-bdba-1e1dd3ccc238",
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "Name of the country",
        example: "Australia",
    })
    @Column()
    name: string;

    @ApiProperty({
        description: "Country code",
        example: "AU",
    })
    @Column()
    code: string;

    // using bidirectional relationship
    @OneToOne(() => Currency, (currency) => currency.country)
    @ApiProperty({ type: () => Currency, description: 'The currency associated with this country' })
    currencies: Currency[];

    @ApiProperty({
        description: "Timestamp when the country was created",
        example: "2024-11-19T12:34:56.789Z",
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: "Timestamp when the country was last updated",
        example: "2024-11-20T15:45:23.123Z",
    })
    @UpdateDateColumn()
    updatedAt: Date;
}
