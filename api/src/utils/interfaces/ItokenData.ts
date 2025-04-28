export interface ITokenData {
    sub: string;
    intent: "access" | "verification" | "reset";
    isVerified: boolean;
    iat: number;
    exp: number;
}