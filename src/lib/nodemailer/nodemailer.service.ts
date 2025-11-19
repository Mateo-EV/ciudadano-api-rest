import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

@Injectable()
export class NodeMailerService {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAIL_HOST"),
      port: this.configService.get<number>("MAIL_PORT"),
      secure: this.configService.get("NODE_ENV") === "production",
      auth: {
        user: this.configService.get<string>("MAIL_USER"),
        pass: this.configService.get<string>("MAIL_PASS")
      }
    })
  }

  async sendMail(
    to: string,
    subject: string,
    html: string
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      const info = await this.transporter.sendMail({
        from: {
          address: this.configService.get<string>("MAIL_ADDRESS") ?? "",
          name: "Ciudadano App"
        },
        to,
        subject,
        html
      })

      return info
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }
}
