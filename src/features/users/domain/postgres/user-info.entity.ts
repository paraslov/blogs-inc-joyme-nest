export class UserInfo {
  user_id: string
  confirmation_code: string
  confirmation_code_expiration_date: Date
  is_confirmed: boolean
  password_recovery_code: string | null
  password_recovery_code_expiration_date: Date | null
  is_password_recovery_confirmed: boolean | null
}
