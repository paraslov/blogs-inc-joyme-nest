import { RegisterUserHandler } from './register-user.command'
import { ConfirmUserHandler } from './confirm-user.command'

export const authCommandHandlers = [RegisterUserHandler, ConfirmUserHandler]
