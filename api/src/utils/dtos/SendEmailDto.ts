import { IsEmail, IsEnum, IsIn, IsString, Length } from "class-validator";

export class SendEmailDto {
    @IsEmail()
    @Length(5, 50, { message: "Email must have from 5 to 50 characters" })
    email: string;

    @IsString()
    @IsIn(["EmailVerification", "PasswordReset"], { message: "Template not found" })
    template: "EmailVerification" | "PasswordReset"
}