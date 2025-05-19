import { Body, Controller, Delete, Get, Put } from "@nestjs/common";
import { UserService } from "src/services/user.service";
import { User } from "src/utils/decorators/user";
import { UpdateUserPassDto } from "src/utils/dtos/UpdateUserPassDto";
import { IreqUserData } from "src/utils/interfaces/IreqUserDAta";

@Controller("user")
export class UserController {
    constructor(private userservice: UserService) { }

    @Get()
    async find(@User() user: IreqUserData) {
        return await this.userservice.find(user.id)
    }

    @Delete()
    async delete(@User() user: IreqUserData) {
        await this.userservice.delete(user.id)
    }

    @Put("reset-password")
    async updatePass(@User() user: IreqUserData, @Body() dto: UpdateUserPassDto) {
        await this.userservice.updatePass(dto, user.id)
    }
}