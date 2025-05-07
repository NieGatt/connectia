import { PickType } from "@nestjs/mapped-types";
import { IsString, IsStrongPassword, Length } from "class-validator";
import { CreateUserDto } from "./CreateUserDto";

export class UpdateUserPassDto extends PickType(CreateUserDto, ["password"]) {
    @IsString()
    @Length(8, 16)
    @IsStrongPassword({ minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 1 }, { message: "Wrong current password." })
    currentPassword: string
}