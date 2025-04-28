import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { TokenType } from "src/utils/decorators/TokenType";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/services/prisma.service";
import { JwtService } from "src/services/jwt.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class TokenTypeGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const tokenType = this.reflector.get(TokenType, context.getHandler());
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization?.split(" ")[1];

        if (!token) throw new UnauthorizedException(`"${tokenType}" token is missing.`);

        try {
            const { sub, intent, isVerified } = this.jwt.validate(token);

            if (intent !== tokenType)
                throw new UnauthorizedException("Wrong access token.");

            if (!isVerified && intent === "reset")
                throw new UnauthorizedException("User is not verified.");

            if (isVerified && intent !== "reset")
                throw new UnauthorizedException("User is already verified.");

            const user = await this.prisma.user.findUnique({ where: { id: sub } });

            if (!user)
                throw new BadRequestException("User not found.");

            request.user = { id: sub };
            return true

        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new UnauthorizedException("This token has expired.");
                }
                throw new UnauthorizedException("Invalid access token.");
            }
            throw new Error("An unexpected error occurred.");
        }
    }
}