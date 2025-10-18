import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CryptoApiService } from '../common/services/crypto-api.service';

@Module({
  imports: [HttpModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CryptoApiService],
  exports: [CategoriesService],
})
export class CategoriesModule {}