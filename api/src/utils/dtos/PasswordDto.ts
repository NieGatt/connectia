import { PickType } from "@nestjs/mapped-types";
import { LoginUserDto } from "./LoginUserDto";

export class PasswordDto extends PickType(LoginUserDto, ["password"]) { }