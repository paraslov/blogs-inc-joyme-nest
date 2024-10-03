import { RegisterUserHandler } from './register-user.command'
import { ConfirmUserHandler } from './confirm-user.command'
import { RegistrationEmailResendingHandler } from './registration-email-resending.command'
import { PasswordRecoveryHandler } from './password-recovery.command'

export const authCommandHandlers = [
  RegisterUserHandler,
  ConfirmUserHandler,
  RegistrationEmailResendingHandler,
  PasswordRecoveryHandler,
]
