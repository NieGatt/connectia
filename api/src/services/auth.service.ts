import { ConflictException, Injectable } from "@nestjs/common"
import { PrismaService } from "./prisma.service";
import { MailerService } from "./mailer.service";
import { IcreateUserData } from "src/utils/interfaces/IcreateUserData";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private mailer: MailerService,
        private hash: HashService,
        private jwt: JwtService
    ) { }

    async regiser(data: IcreateUserData) {


    }
}