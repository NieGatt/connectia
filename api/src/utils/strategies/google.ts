import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2"
import "dotenv/config"

@Injectable()
export class GoogleOauth20 extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_REDIRECT_URL!,
            scope: ["profile", "email"]
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const { given_name, family_name, verified, emails, photos } = profile;

        const user = {
            sort: 'GOOGLE',
            email: emails?.[0]?.value,
            firstName: given_name,
            lastName: family_name,
            image: photos?.[0]?.value,
            isVerified: verified
        };
        return done(null, user)
    }
}