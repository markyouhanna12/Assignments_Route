import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CacheModule } from 'src/cache/cache.module';
import { EncryptionModule } from 'src/Common/Encryption/encryption.module';
import { TokenModule } from 'src/Common/Tokens/token.module';
import { UserModel } from 'src/DB/Models/user.model';

@Module({
  imports: [UserModel, TokenModule, EncryptionModule, CacheModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
