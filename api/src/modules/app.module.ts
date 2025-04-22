import { Module } from '@nestjs/common';
import { UtilsModule } from './utils.module';

@Module({
  imports: [UtilsModule]
})
export class AppModule { }
