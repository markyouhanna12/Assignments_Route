import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RedisService } from '../cache.service';
import { map, of } from 'rxjs';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `cache:${request.originalUrl || request.url}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return of(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('Redis read failer safely skipped', error);
    }

    return next.handle().pipe(
      map(async (data) => {
        try {
          if (data) {
            await this.redisService.set(cacheKey, JSON.stringify(data), 300);
          }
        } catch (error) {
          console.error('Redis write Failer', error);
        }
        return data;
      }),
    );
  }
}
