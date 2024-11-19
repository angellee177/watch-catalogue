import { Module } from '@nestjs/common';
import { CountryController } from './countries.controller';
import { CountryService } from './countries.service';
import  { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}