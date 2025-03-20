import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('redis.host', 'localhost'),
      port: this.configService.get<number>('redis.port', 6379),
      password: this.configService.get<string>('redis.password'),
    });

    this.redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async setAccessToken(
    userId: string,
    token: string,
    expiresIn: number,
  ): Promise<void> {
    const key = `access_token:${userId}`;
    await this.redisClient.set(key, token, 'EX', expiresIn);
  }

  async getAccessToken(userId: string): Promise<string | null> {
    const key = `access_token:${userId}`;
    return this.redisClient.get(key);
  }

  async removeAccessToken(userId: string): Promise<void> {
    const key = `access_token:${userId}`;
    await this.redisClient.del(key);
  }

  async isAccessTokenValid(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.getAccessToken(userId);
    return storedToken === token;
  }
}
