import { CreateUserHandler } from './create-user.command'
import { DeleteUserHandler } from './delete-user.command'

export const commandHandlers = [CreateUserHandler, DeleteUserHandler]
