import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { LoggerMiddlewareFunc } from '../base/middlewares/logger.middleware'
import { HttpExceptionFilter } from '../base/exceptionFilters/http-exception.filter'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from './configuration'
import cookieParser from 'cookie-parser'
import { AppModule } from '../app.module'
import { useContainer } from 'class-validator'

const APP_PREFIX = '/api'

export const applyAppSettings = (app: INestApplication) => {
  app.enableCors()

  // app.useGlobalInterceptors()

  //  app.useGlobalGuards(new AuthGuard());

  app.use(LoggerMiddlewareFunc)
  app.use(cookieParser())

  setAppUseContainersToEnableCustomClassValidatorDecorators(app)
  setAppPrefix(app)
  setSwagger(app)
  setAppPipes(app)
  setAppExceptionsFilters(app)
}

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX)
}

const setSwagger = (app: INestApplication) => {
  const config = app.get(ConfigService<ConfigurationType, true>)
  const environmentSettings = config.get('environmentSettings', {
    infer: true,
  })

  if (!environmentSettings.isProduction) {
    const swaggerPath = APP_PREFIX + '/swagger-doc'

    const config = new DocumentBuilder().setTitle('JoymeStudios Blogs API').addBearerAuth().setVersion('1.0').build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: 'JoymeStudios Blogs Swagger',
    })
  }
}

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors = []

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints)

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey]

            customErrors.push({ key: e.property, message: msg })
          })
        })

        throw new BadRequestException(customErrors)
      },
    }),
  )
}

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter())
}

const setAppUseContainersToEnableCustomClassValidatorDecorators = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
}
