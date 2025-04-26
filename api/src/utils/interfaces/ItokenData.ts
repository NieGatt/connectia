export interface ITokenData {
    sub: string;
    intent: "access" | "verifiation" | "reset";
    isVerified: boolean;
    iat: number;
    exp: number;
}