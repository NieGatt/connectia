import { BadRequestException, Body, Controller, Delete, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "src/utils/decorators/user";
import { IreqUserData } from "src/utils/interfaces/IreqUserDAta";
import { Express } from "express";
import { mediaFileOptions } from "src/utils/multer/mediaFileOptions";
import { PostService } from "src/services/post.service";

@Controller("post")
export class PostController {
    constructor(private postService: PostService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', mediaFileOptions))
    async createPost(
        @User() user: IreqUserData,
        @Body() dto: any,
        @UploadedFile() file?: Express.Multer.File,
    ) { 
        await this.postService.createPost(user.id, file?.path, dto?.text);
        return "Ok"
    }

    @Delete()
    async deletePost() { }
}
