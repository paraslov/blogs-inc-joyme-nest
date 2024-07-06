import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppSettings } from './settings/appSettings'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(AppSettings.PORT)
}
bootstrap()
