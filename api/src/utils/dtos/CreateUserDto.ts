import { IsEmail, IsString, Length, Matches } from "class-validator"

export class CreateUserDto {
    @IsString()
    @Matches(/^\p{L}{3,50}$/gui)
    firstName: string;

    @IsString()
    @Matches(/^\p{L}{3,50}$/gui)
    lastName: string;

    @IsEmail()
    @Length(5, 50)
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[0-9\(\)\?><=\+&%\$#@\!:;\{\}-]){8,16}$/)
    password: string;
}