export interface IsendEmailData {
    name: string;
    token: string;
    email: string;
    template: "EmailVerification" | "PasswordReset"
}