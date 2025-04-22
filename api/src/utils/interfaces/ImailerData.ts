enum TemplateName {
    "EmailVerification",
    "PasswordReset"
}

export interface ImailerData {
    name: string;
    token: string;
    email: string;
    template: TemplateName
}