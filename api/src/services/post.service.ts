import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService
    ) { }

    async createPost(userId: string, filePath?: string, text?: string) {
        if (!text && !filePath) throw new BadRequestException("At least one of the fields text/file must exist.");

        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        await this.prisma.post.create({
            data: {
                profileId: profile?.id,
                media: filePath,
                text
            }
        })
    }
}