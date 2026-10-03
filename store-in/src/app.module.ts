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
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';

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
    CategoryModule,
    BrandModule,
    ProductsModule,
    CartModule,
    ReviewsModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
