export class EmailSendManagerMock {
  async sendRegistrationEmail(email: string, confirmationCode: string) {
    return `success sendRegistrationEmail to: ${email} with confirmation code ${confirmationCode}`
  }
  async resendRegistrationEmail(email: string, confirmationCode: string) {
    return `success resendRegistrationEmail to: ${email} with confirmation code ${confirmationCode}`
  }
  async sendPasswordRecoveryEmail(email: string, confirmationCode: string) {
    return `success sendPasswordRecoveryEmail to: ${email} with confirmation code ${confirmationCode}`
  }
}
