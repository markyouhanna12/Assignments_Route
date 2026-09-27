import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingIntercepotor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const startTime = Date.now();
    if (context.getType<string>() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();

      const method = request.method;
      const url = request.url;

      this.logger.log(`Before Handling router : [${method}] ${url}`);

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - startTime;

          this.logger.log(
            `After Handling router : [${method}] ${url} - Took: ${duration}ms`,
          );
        }),
      );
    }

    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      const info = gqlContext.getInfo();

      const operationName = info.fieldName;

      this.logger.log(`Before Handling GraphQL Query : [${operationName}]`);

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - startTime;

          this.logger.log(
            `After Handling GraphQL Query : [${operationName}] - Took: ${duration}ms`,
          );
        }),
      );
    }

    return next.handle();
  }
}
