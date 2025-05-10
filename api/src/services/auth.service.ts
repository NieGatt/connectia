import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "./prisma.service";
import { MailerService } from "./mailer.service";
import { IcreateUserData } from "src/utils/interfaces/IcreateUserData";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";
import { IloginUser } from "src/utils/interfaces/IloginUser";
import { IgoogleUserData } from "src/utils/interfaces/IgoogleUserData";

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
                },
                Prifle: { create: {} }
            }
        });

        const token = this.jwt.create({
            sub: createdUser.id,
            isVerified: false,
            intent: "verification",
            exp: "3d"
        });

        await this.mailer.send({
            token,
            email: createdUser.email,
            name: `${createdUser.firstName} ${createdUser.lastName}`,
            template: "EmailVerification"
        });
    }

    async google(data: IgoogleUserData) {
        const { isVerified, lastName, firstName, email, sort, photoUrl } = data;
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            const user = await this.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    Login: {
                        create: {
                            isVerified,
                            sort
                        }
                    },
                    Prifle: {
                        create: {
                            photoUrl
                        }
                    }
                }
            });

            const accessToken = this.jwt.create({
                intent: "access",
                exp: "30m",
                isVerified,
                sub: user.id
            });
            const refreshToken = this.jwt.createRefresh(user.id);
            const hashedRt = this.hash.hashData(refreshToken);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    Login: {
                        update: {
                            hashedRt
                        }
                    }
                }
            });

            return { refreshToken, accessToken }
        };

        const accessToken = this.jwt.create({
            intent: "access",
            exp: "30m",
            isVerified,
            sub: user.id
        });

        const refreshToken = this.jwt.createRefresh(user.id);
        const hashedRt = this.hash.hashData(refreshToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                Login: {
                    update: {
                        hashedRt
                    }
                }
            }
        });
        return { refreshToken, accessToken }
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

        if (!user?.Login) throw new BadRequestException("User not found.");

        const { Login: { isVerified } } = user
        if (!isVerified) throw new UnauthorizedException("User not verified.");

        const isPassEqual = this.hash.compareData(data.password, user.password!);
        if (!isPassEqual) throw new BadRequestException("Incorrect email or password.");

        const accessToken = this.jwt.create({
            sub: user.id,
            intent: "access",
            isVerified,
            exp: "30m"
        })
        const refreshToken = this.jwt.createRefresh(user.id);

        const hashedRefreshToken = this.hash.hashData(refreshToken);
        await this.prisma.login.update({
            where: { userId: user.id },
            data: { hashedRt: hashedRefreshToken }
        })

        return { accessToken, name: user.firstName, refreshToken }
    }

    async logout(id: string) {
        const user = await this.prisma.login.update({
            where: { userId: id },
            data: {
                lastLogout: new Date(),
                hashedRt: null
            },
            include: { User: true }
        })
        return {
            name: user.User.firstName,
            lastLogoutAt: user.lastLogout
        }
    }

    async validate(id: string) {
        await this.prisma.login.update({
            where: { userId: id },
            data: {
                isVerified: true
            }
        })
    }

    async verification(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { Login: true }
        });

        if (!user?.Login) throw new BadRequestException("User not found.");

        const { Login: { isVerified }, id, firstName, lastName } = user

        if (isVerified) throw new BadRequestException("User already verified.");

        const token = this.jwt.create({
            intent: "verification",
            isVerified,
            sub: id,
            exp: "3d"
        })

        await this.mailer.send({
            name: `${firstName} ${lastName}`,
            email,
            template: "EmailVerification",
            token
        })

        return firstName
    }

    async forgot(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { Login: true }
        });

        if (!user?.Login) throw new BadRequestException("User not found.");

        const { Login: { isVerified }, firstName, lastName, id } = user

        if (!isVerified) throw new ForbiddenException("User not verified.");

        if (user.password) {
            const token = this.jwt.create({
                intent: "reset",
                sub: id,
                isVerified,
                exp: "1h"
            })

            await this.mailer.send({
                email,
                name: `${firstName} ${lastName}`,
                template: "PasswordReset",
                token
            })
        }

        return firstName
    }

    async reset(id: string, newPass: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        const isEqual = this.hash.compareData(newPass, user!.password!);

        if (isEqual) throw new BadRequestException("New password cannot be the same as the previous one.");

        const hashedPass = this.hash.hashData(newPass);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPass }
        });
    }

    async refreshToken(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        const accessToken = this.jwt.create({
            exp: "30m",
            intent: "access",
            isVerified: true,
            sub: user!.id
        });
        return { accessToken, name: user!.firstName }
    }
}