import * as jwt from "jsonwebtoken"
import "dotenv/config"
import { Injectable } from "@nestjs/common"
import { ITokenData } from "src/utils/interfaces/ItokenData";

@Injectable()
export class JwtService {
    private sharedSecret = process.env.SHARED_SECRET ?? "";
    private refreshSecret = process.env.REFRESH_SECRET ?? "";

    constructor() {
        if (!this.sharedSecret || !this.refreshSecret)
            throw new Error("Failed to grant access due to misconfiguration")
    }

    create(data: Omit<ITokenData, "iat">): string {
        return jwt.sign({ ...data }, this.sharedSecret)
    }

    validate(token: string): ITokenData {
        return this.validateToken(token, this.sharedSecret)
    }

    createRefresh(sub: string): string {
        return jwt.sign({ sub }, this.refreshSecret, {
            expiresIn: "7d"
        })
    }

    validateRefresh(token: string): ITokenData {
        return this.validateToken(token, this.refreshSecret)
    }

    private validateToken(token: string, secret: string): ITokenData {
        return jwt.verify(token, secret) as unknown as ITokenData;
    }
}