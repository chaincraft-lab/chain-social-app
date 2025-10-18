import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './services/search.service';
import { ArticleSearchService } from './services/article-search.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService, ArticleSearchService],
  exports: [SearchService, ArticleSearchService],
})
export class SearchModule {}