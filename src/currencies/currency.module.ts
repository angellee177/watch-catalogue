import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entity/currency.entity';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Country } from '../countries/entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Country])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
