import { BadRequestException, Body, Controller, Get, Param, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { User } from "src/utils/decorators/user";
import { IreqUserData } from "src/utils/interfaces/IreqUserDAta";
import { FileInterceptor } from "@nestjs/platform-express"
import { profileFileOptions } from "src/utils/multer/ProfileFileOptions";
import { Express } from "express"
import { UpdateUserDto } from "src/utils/dtos/UpdateUserDto";
import { ProfileService } from "src/services/profile.service";
import { Uuiddto } from "src/utils/dtos/UuidDto";

@Controller("profile")
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get()
    async me(@User() user: IreqUserData) {
        const data = await this.profileService.find(user.id);
        return data
    }

    @Get(":id")
    async others(@Param() params: Uuiddto) {
        const data = await this.profileService.find(params.uuid);
        return data
    }

    @Patch()
    @UseInterceptors(FileInterceptor('file', profileFileOptions))
    async update(
        @User() user: IreqUserData,
        @Body() dto: UpdateUserDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        await this.profileService.update(user.id, { ...dto, image: file?.path });
        return "Ok"
    }
}