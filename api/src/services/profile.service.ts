import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { IupdateUser } from "src/utils/interfaces/IupdateUser";

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async find(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                Prifle: {
                    select: {
                        image: true,
                        id: true,
                        bio: true,
                        websiteLink: true,
                        websiteName: true,
                        createdAt: true,
                        Post: true
                    }
                }
            }
        })
    }

    async update(id: string, data: IupdateUser) {
        const profile = {
            image: data.image,
            bio: data.bio,
            websiteLink: data.websiteLink,
            websiteName: data.websiteName
        };
        const user = {
            firstName: data.firstName,
            lastName: data.lastName
        };

        let userFields: Partial<typeof user> = {};
        let profileFields: Partial<typeof profile> = {};

        for (const key of Object.keys(profile) as (keyof typeof profile)[]) {
            if (profile[key] !== undefined) profileFields[key] = profile[key]
        };

        for (const key of Object.keys(user) as (keyof typeof user)[]) {
            if (user[key] !== undefined) userFields[key] = user[key]
        }

        if (userFields) await this.prisma.user.update({
            where: { id },
            data: { ...userFields }
        });

        if (profileFields) await this.prisma.profile.update({
            where: { userId: id },
            data: { ...profileFields }
        })
    }
}