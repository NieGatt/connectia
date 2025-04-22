enum TokenIntent {
    "access",
    "verifiation",
    "reset"
}

export interface ITokenData {
    sub: number;
    intent: TokenIntent;
    isVerified: boolean;
    iat: number;
    exp: number;
}