import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchController } from './watch.controller';
import { WatchService } from './watch.service';
import { Watch } from './entity/watch.entity';
import { BrandModule } from '../brands/brand.module';
import { CurrencyModule } from '../currencies/currency.module';
import { CountryModule } from '../countries/countries.module'; 
import { Currency } from '../currencies/entity/currency.entity';
import { Brand } from '../brands/entity/brand.entity';
import { Country } from '../countries/entity/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Watch, Country, Brand, Currency]),
    BrandModule, 
    CurrencyModule,
    CountryModule,
  ],
  controllers: [WatchController],
  providers: [WatchService],
})
export class WatchModule {}
