import { Body, Controller, Get, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { TokenType } from "src/utils/decorators/TokenType";
import { User } from "src/utils/decorators/user";
import { TokenTypeGuard } from "src/utils/guards/TokenTypeGuard.guard";
import { AuthService } from "src/services/auth.service";
import { CreateUserDto } from "src/utils/dtos/CreateUserDto";
import { LoginUserDto } from "src/utils/dtos/LoginUserDto";
import { IreqUserData } from "src/utils/interfaces/IreqUserDAta";
import { EmailDto } from "src/utils/dtos/EmailDto";
import { PasswordDto } from "src/utils/dtos/PasswordDto";
import { RefreshTokenGuard } from "src/utils/guards/RefreshTokenGuard.guard";

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
    async login(@Res() res: Response, @Body() dto: LoginUserDto) {
        const { name, accessToken, refreshToken } = await this.authService.login(dto);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken")
        res.cookie("accessToken", accessToken, {
            secure: false,
            sameSite: true,
            httpOnly: true,
            maxAge: Math.floor(Date.now() / 1000) + (60 * 30),
        });
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            sameSite: true,
            httpOnly: true,
            maxAge: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
        })
        res.send(`Welcome back, ${name}!`)
    }

    @Post("logout")
    async logout(@Res() res: Response, @User() user: IreqUserData) {
        const data = await this.authService.logout(user.id);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({
            message: `See you soon, ${data.name}`,
            logoutAt: data.lastLogoutAt
        })
    }

    @Put("validate")
    @UseGuards(TokenTypeGuard)
    @TokenType("verification")
    async validate(@User() user: IreqUserData) {
        await this.authService.validate(user.id);
        return "User validated successfully."
    }

    @Post("verification")
    async verification(@Body() dto: EmailDto) {
        const name = await this.authService.verification(dto.email);
        const [userPart, domain] = dto.email.split("@");
        const email = `${userPart.slice(0, 3)}***@${domain}`;
        return `Hello, ${name}! We sent a verification link to ${email}.`
    }

    @Post("forgot-password")
    async forgot(@Body() dto: EmailDto) {
        const name = await this.authService.forgot(dto.email);
        return `Hello, ${name}! We sent a verification link to ${dto.email}. Click on it to reset your password.`
    }

    @Put("reset-password")
    @UseGuards(TokenTypeGuard)
    @TokenType("reset")
    async reset(
        @Res() res: Response, @Body() dto: PasswordDto, @User() user: IreqUserData) {
        await this.authService.reset(user.id, dto.password);
        res.clearCookie("accessToken");
        res.send("Ok");
    }

    @Get("refresh-token")
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Res() res: Response, @User() user: IreqUserData) {
        const { accessToken, name } = await this.authService.refreshToken(user.id);
        res.clearCookie("accessToken");
        res.cookie("accessToken", accessToken, {
            secure: false,
            sameSite: true,
            httpOnly: true,
            maxAge: Math.floor(Date.now() / 1000) + (60 * 30),
        });
        res.send(`Welcome back, ${name}!`)
    }
}