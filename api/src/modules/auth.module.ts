import { Module } from "@nestjs/common";
import { AuthController } from "src/controllers/auth.controller";
import { AuthService } from "src/services/auth.service";
import { GoogleOauth20 } from "src/utils/strategies/google";

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleOauth20]
})
export class AuthModule { }