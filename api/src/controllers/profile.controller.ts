import { Controller, Get, Param, Patch } from "@nestjs/common";
import { User } from "src/utils/decorators/user";
import { IreqUserData } from "src/utils/interfaces/IreqUserDAta";

@Controller("profile")
export class ProfileController {
    constructor() { }

    @Get()
    async me(@User() user: IreqUserData) { }

    @Get(":id")
    async others(@Param("id") id: string) { }

    @Patch()
    async change() { }
}