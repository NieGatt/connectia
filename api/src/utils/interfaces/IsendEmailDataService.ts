type TemplateType = "EmailVerification" | "PasswordReset"
export interface IsendEmailDataService {
    email: string;
    template: TemplateType
}