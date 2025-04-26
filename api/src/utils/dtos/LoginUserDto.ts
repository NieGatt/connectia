import { PickType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./CreateUserDto";

export class LoginUserDto extends PickType(CreateUserDto, ["email", "password"]) { }