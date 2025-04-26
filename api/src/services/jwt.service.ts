import * as jwt from "jsonwebtoken"
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"
import "dotenv/config"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ITokenData } from "src/utils/interfaces/ItokenData";

@Injectable()
export class JwtService {
    private sharedSecret = process.env.SHARED_SECRET ?? "";
    private refreshSecret = process.env.REFRESH_SECRET ?? "";

    constructor() {
        if (!this.sharedSecret || !this.refreshSecret)
            throw new Error("Failed to grant access due to misconfiguration")
    }

    create(data: ITokenData): string {
        return jwt.sign({ ...data }, this.sharedSecret)
    }

    validate(token: string): Error | ITokenData {
        return this.validateToken(token, this.sharedSecret)
    }

    createRefresh(data: Pick<ITokenData, "exp" | "sub">): string {
        return jwt.sign({ ...data }, this.refreshSecret)
    }

    validateRefresh(token: string): Error | ITokenData {
        return this.validateToken(token, this.refreshSecret)
    }

    private validateToken(token: string, secret: string): Error | ITokenData {
        try {
            return jwt.verify(token, secret) as unknown as ITokenData;
        } catch (error) {
            switch (error) {
                case error instanceof TokenExpiredError:
                    throw new UnauthorizedException("This token has expired");
                case error instanceof JsonWebTokenError:
                    throw new UnauthorizedException("This token is Invalid");
                default:
                    throw new Error("Internal server error");
            }
        }
    }
}