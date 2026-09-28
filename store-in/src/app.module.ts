import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './DB/database.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './Common/Middlewares/logger.middleware';
import { AuthController } from './auth/auth.controller';
import { CacheModule } from './cache/cache.module';
import { UserModule } from './user/user.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),
    DatabaseModule,
    MailModule,
    CacheModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
