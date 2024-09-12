import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest()
  const userId = request.user.userId

  if (!userId) {
    throw new Error('JWT Guard must be used! (userId is absent)')
  }

  return userId
})
