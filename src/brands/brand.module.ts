import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "./entity/brand.entity";
import { Country } from "../countries/entity/country.entity";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Country])],
    providers: [BrandService],
    controllers: [BrandController],
})
export class BrandModule {}