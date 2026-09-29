import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { BrandModel } from 'src/DB/Models/brand.model';
import { ProductModel } from 'src/DB/Models/products.model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/Common/Tokens/token.service';

@Module({
  imports: [UserModel, CategoryModel, BrandModel, ProductModel],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService, TokenService],
})
export class ProductsModule {}
