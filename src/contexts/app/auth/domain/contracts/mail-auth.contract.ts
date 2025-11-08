export abstract class MailAuthContract {
  abstract sendVerificationCodeEmail(email: string, code: string): Promise<void>
}
