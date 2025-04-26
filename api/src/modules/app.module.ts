import { Module } from '@nestjs/common';
import { UtilsModule } from './utils.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [UtilsModule, AuthModule]
})
export class AppModule { }
