import { PickType } from "@nestjs/mapped-types";
import { IsEmail, IsEnum, IsIn, IsString, Length } from "class-validator";
import { LoginUserDto } from "./LoginUserDto";

export class EmailDto extends PickType(LoginUserDto, ["email"]) { }