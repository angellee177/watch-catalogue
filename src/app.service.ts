import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    console.log('Database Config:', this.configService.get('typeorm'));  // Log the typeorm config
  }

  getHello(): string {
    return 'Hello World!';
  }
}