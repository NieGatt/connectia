import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { JwtService } from "src/services/jwt.service";
import { ITokenData } from "../interfaces/ItokenData";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HashService } from "src/services/hash.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private hash: HashService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const accessToken = request.cookies["accessToken"];
        const refreshToken = request.cookies["refreshToken"];

        if (!accessToken) throw new UnauthorizedException("Access token is missing.");

        const data = this.jwt.decodeToken(accessToken) as ITokenData;
        if (data.intent !== "access") throw new UnauthorizedException("Unauthorized access token.");

        const user = await this.prisma.user.findUnique({
            where: { id: data.sub },
            include: { Login: true }
        })

        if (!user?.Login) throw new NotFoundException("User not found.");

        const { isVerified, lastLogout, hashedRt } = user.Login;

        if (!isVerified) throw new UnauthorizedException("User not verified.");
        if (!hashedRt) throw new UnauthorizedException("Unable to refresh access token.");

        if (lastLogout && data.iat * 1000 < lastLogout.valueOf())
            throw new UnauthorizedException("Login again to get access to the system.");

        const isEqual = this.hash.compareData(refreshToken, hashedRt);
        if (!isEqual) throw new UnauthorizedException("Unauthorized refresh token.");

        try {
            this.jwt.validateRefresh(refreshToken);
            request.user = { id: data.sub };
            return true
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new UnauthorizedException("This token has expired.");
                }
                throw new UnauthorizedException("Invalid access token.");
            }
            throw new Error(error);
        }
    }
}