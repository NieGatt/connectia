import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { IupdateUser } from "src/utils/interfaces/IupdateUser";
import { HashService } from "./hash.service";
import { UpdateUserPass } from "src/utils/interfaces/UpdateUserPass";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private hash: HashService
    ) { }

    async find(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        })
    }

    async delete(id: string) {
        await this.prisma.user.delete({ where: { id } })
    }

    async updatePass(data: UpdateUserPass, id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user?.password) throw new BadRequestException("Wrong current password.");

        const equal = this.hash.compareData(data.currentPassword, user.password);
        const equalTheLastOne = this.hash.compareData(data.password, user.password);

        if (!equal) throw new BadRequestException("Wrong current password.");
        if (equalTheLastOne) throw new BadRequestException("New password cannot be the same as the last one.");

        const hashedPass = this.hash.hashData(data.password);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPass }
        })
    }
}