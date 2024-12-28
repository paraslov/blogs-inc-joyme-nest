export class UserData {
  login: string
  email: string
  passwordHash: string
  createdAt: string
}

export class UserConfirmationData {
  confirmationCode: string
  confirmationCodeExpirationDate: Date
  isConfirmed: boolean
  passwordRecoveryCode?: string
  passwordRecoveryCodeExpirationDate?: Date
  isPasswordRecoveryConfirmed?: boolean
}

export class User {
  userData: UserData
  userConfirmationData: UserConfirmationData
}
