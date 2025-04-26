import { Module, Global } from "@nestjs/common";
import { HashService } from "src/services/hash.service";
import { JwtService } from "src/services/jwt.service";
import { MailerService } from "src/services/mailer.service";
import { PrismaService } from "src/services/prisma.service";

@Global()
@Module({
    providers: [PrismaService, HashService, JwtService, MailerService],
    exports: [PrismaService, HashService, JwtService, MailerService]
})
export class UtilsModule { }