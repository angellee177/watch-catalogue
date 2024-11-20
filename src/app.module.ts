import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { CountryModule } from '../src/countries/countries.module';
import { CurrencyModule } from './currencies/currency.module';
import { BrandModule } from './brands/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    AuthModule,
    UsersModule,
    CountryModule,
    CurrencyModule,
    BrandModule,
    // WatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
