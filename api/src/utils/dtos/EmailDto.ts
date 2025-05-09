import { PickType } from "@nestjs/mapped-types";
import { LoginUserDto } from "./LoginUserDto";

export class EmailDto extends PickType(LoginUserDto, ["email"]) { }