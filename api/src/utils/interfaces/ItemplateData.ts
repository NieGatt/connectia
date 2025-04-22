enum TemplateName {
    "EmailVerification",
    "PasswordReset"
}

export interface ItemplateDAta {
    name: string;
    token: string;
    template: TemplateName
}