import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Store } from 'cache-manager';
import { Redis } from 'ioredis';
interface RedisStore extends Store {
  getClient: () => Redis;
}

export interface RedisCache extends Cache {
  store: RedisStore;
}

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;

  constructor(@Inject(CACHE_MANAGER) cacheManager: RedisCache) {
    this.redisClient = cacheManager.store.getClient();
  }

  getRedisClient(): Redis {
    return this.redisClient;
  }
}
