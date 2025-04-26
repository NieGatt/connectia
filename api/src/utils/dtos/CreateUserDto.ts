import { IsEmail, IsString, Length, Matches } from "class-validator"

export class CreateUserDto {
    @IsString()
    @Matches(/^[\p{L}'\s]{3,50}$/gui)
    firstName: string;

    @IsString()
    @Matches(/^[\p{L}'\s]{3,50}$/gui)
    lastName: string;

    @IsEmail()
    @Length(5, 50, { message: "Email must have from 5 to 50 characters" })
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9\(\)\?><\=\+&%\$#@\!\:;\{\}]).{8,16}$/)
    password: string;
}