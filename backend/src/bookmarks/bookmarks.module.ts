import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [BookmarksService, PrismaService],
  controllers: [BookmarksController],
  exports: [BookmarksService]
})
export class BookmarksModule {}
