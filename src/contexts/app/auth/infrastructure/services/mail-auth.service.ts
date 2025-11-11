import { NodeMailerService } from "@/lib/nodemailer/nodemailer.service"
import { Injectable } from "@nestjs/common"
import { MailAuthContract } from "../../domain/contracts/mail-auth.contract"

@Injectable()
export class MailAuthService implements MailAuthContract {
  constructor(private readonly nodeMailerService: NodeMailerService) {}

  async sendVerificationCodeEmail(email: string, code: string): Promise<void> {
    const html = `
      <p>Hi,</p>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>Thank you!</p>
    `

    await this.nodeMailerService.sendMail(email, "Email Verification", html)
  }

  async sendPasswordResetCodeEmail(email: string, code: string): Promise<void> {
    const html = `
      <p>Hi,</p>
      <p>Your password reset code is: <strong>${code}</strong></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you!</p>
    `

    await this.nodeMailerService.sendMail(email, "Password Reset Request", html)
  }
}
