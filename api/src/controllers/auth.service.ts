import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
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

    @Post("login")
    async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginUserDto) {
        const { name, accessToken } = await this.authService.login(dto);
        res.cookie("acccessToken", accessToken, {
            secure: false,
            sameSite: true,
            httpOnly: true,
            maxAge: 60000 * 60 * 24 * 7
        })
        return `Welcome back, ${name}!`
    }
}