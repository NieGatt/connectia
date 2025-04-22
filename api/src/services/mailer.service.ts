import { createTransport } from "nodemailer"
import "dotenv/config"
import { Injectable } from "@nestjs/common"
import { ImailerData } from "src/utils/interfaces/ImailerData"
import { templateMaker } from "src/utils/handlebars/TemplateMaker"

@Injectable()
export class MailerService {
    private mailerConfig() {
        return createTransport({
            host: process.env.SMTP_HOST,
            secure: false,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        })
    }

    async send(data: ImailerData) {
        const { name, email, template, token } = data
        const transporter = this.mailerConfig()
        const html = templateMaker({ name, template, token })
        await transporter.sendMail({ 
            from: "rafaellsza03@gmail.com",
            to: email,
            html
         })
    }
}
