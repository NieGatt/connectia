import { PickType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./CreateUserDto";
import { IsString, IsStrongPassword, Length } from "class-validator";

export class LoginUserDto extends PickType(CreateUserDto, ["email"]) {
    @IsString()
    @Length(8, 16)
    @IsStrongPassword({ minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 1 }, { message: "Incorrect email or password." })
    password: string;
}