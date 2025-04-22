import { Body, Controller } from "@nestjs/common";
import { CreateUserDto } from "src/utils/dtos/CreateUserDto";

@Controller("auth")
export class AuthController {
    constructor() {}

    register(@Body() dto: CreateUserDto) {
        
    }
}