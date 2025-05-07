import { OmitType, PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUserDto";

export class UpdateUserDto extends PickType(CreateUserDto, ["firstName", "lastName"]) { }