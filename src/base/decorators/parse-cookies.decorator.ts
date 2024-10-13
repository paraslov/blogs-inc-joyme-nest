import { createParamDecorator, ExecutionContext } from '@nestjs/common'
/*
 example of usage:
    @Get()
    findAll(@Cookies('name') name: string) {}
 */
export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return data ? request.cookies?.[data] : request.cookies
})
