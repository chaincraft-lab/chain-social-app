import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('🚀 Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('💾 Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Clean database in reverse order of dependencies
    const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');
    
    return Promise.all(
      models.map((modelKey) => this[modelKey].deleteMany())
    );
  }

  async getHealth() {
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }
}