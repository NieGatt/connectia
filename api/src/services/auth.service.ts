import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "./prisma.service";
import { MailerService } from "./mailer.service";
import { IcreateUserData } from "src/utils/interfaces/IcreateUserData";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";
import { IloginUser } from "src/utils/interfaces/ILoginUser";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private mailer: MailerService,
        private hash: HashService,
        private jwt: JwtService
    ) { }

    async regiser(data: IcreateUserData) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (user) throw new ConflictException("User already exists.");

        data.password = this.hash.hashData(data.password);
        const createdUser = await this.prisma.user.create({
            data: {
                ...data,
                Login: {
                    create: {
                        isVerified: false
                    }
                }
            }
        });

        const token = this.jwt.create({
            exp: 60000 * 60 * 24 * 3,
            sub: createdUser.id,
            isVerified: false,
            intent: "verifiation",
            iat: Date.now()
        });

        await this.mailer.send({
            token,
            email: createdUser.email,
            name: `${createdUser.firstName} ${createdUser.lastName}`,
            template: "EmailVerification"
        });
    }

    async login(data: IloginUser) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email,
                Login: { sort: "SYSTEM" }
            },
            select: {
                id: true,
                firstName: true,
                password: true,
                Login: true
            },
        })

        if (!user) throw new BadRequestException("User not found.");
        if (!user.Login?.isVerified) throw new UnauthorizedException("User not verified.");

        const isPassEqual = this.hash.compareData(data.password, user.password!);

        if (!isPassEqual) throw new BadRequestException("Incorrect email or password.");

        const accessToken = this.jwt.create({
            sub: user.id,
            exp: 1000 * 60 * 30,
            iat: Date.now(),
            intent: "access",
            isVerified: user.Login.isVerified
        })
        const refreshToken = this.jwt.createRefresh({
            exp: 60000 * 60 * 24 * 7,
            sub: user.id
        })

        const hashedRefreshToken = this.hash.hashData(refreshToken);
        await this.prisma.login.update({
            where: { userId: user.id },
            data: { refreshToken: hashedRefreshToken }
        })

        return { accessToken, name: user.firstName }
    }
}