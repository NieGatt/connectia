import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UtilsModule } from './utils.module';
import { AuthModule } from './auth.module';
import { AuthMiddleware } from 'src/utils/middlewares/AuthMiddleware';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';

@Module({
  imports: [UtilsModule, AuthModule, UserModule, ProfileModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "auth/logout", method: RequestMethod.POST },
        { path: "user", method: RequestMethod.ALL },
        { path: "user/reset-password", method: RequestMethod.PUT },
        { path: "profile", method: RequestMethod.PATCH },
        { path: "profile", method: RequestMethod.GET }
      )
  }
}
