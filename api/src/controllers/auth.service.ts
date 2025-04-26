import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/services/auth.service";
import { CreateUserDto } from "src/utils/dtos/CreateUserDto";
import { LoginUserDto } from "src/utils/dtos/LoginUserDto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("register")
    async register(@Body() dto: CreateUserDto) {
        await this.authService.regiser(dto);
        const [userPart, domain] = dto.email.split("@");
        const email = `${userPart.slice(0, 3)}***@${domain}`;
        return `Hello, ${dto.firstName}! We sent a verification link to ${email}.`
    }
}