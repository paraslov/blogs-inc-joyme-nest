import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

// https://docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse = {
        errorsMessages: [],
      }
      const addedFields = []

      const responseBody: any = exception.getResponse()

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((error: any) => {
          if (!addedFields.includes(error.key)) {
            errorsResponse.errorsMessages.push({ field: error.key, message: error.message })
          }

          addedFields.push(error.key)
        })
      } else {
        errorsResponse.errorsMessages.push(responseBody.message)
      }
      console.log('@> errorsResponse: ', errorsResponse)

      response.status(status).json(errorsResponse)
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
