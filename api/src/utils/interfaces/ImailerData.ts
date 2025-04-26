export interface ImailerData {
    name: string;
    token: string;
    email: string;
    template: "EmailVerification" | "PasswordReset"
}