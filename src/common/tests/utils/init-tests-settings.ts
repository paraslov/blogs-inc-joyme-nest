import { Test, TestingModuleBuilder } from '@nestjs/testing'

import { Connection } from 'mongoose'
import { getConnectionToken } from '@nestjs/mongoose'
import { deleteAllData } from './delete-all-data'
import { UsersTestManager } from './users-test-manager'
import configuration, { ConfigurationType } from '../../../settings/configuration'
import { AppModule } from '../../../app.module'
import { applyAppSettings } from '../../../settings/apply.app.settings'
import { ConfigService } from '@nestjs/config'

export const initTestsSettings = async (addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void) => {
  console.log('in tests ENV: ', configuration().environmentSettings.currentEnv)
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder)
  }

  const testingAppModule = await testingModuleBuilder.compile()

  const app = testingAppModule.createNestApplication()

  applyAppSettings(app)

  await app.init()

  const databaseConnection = app.get<Connection>(getConnectionToken())
  const httpServer = app.getHttpServer()
  const configService = app.get<ConfigService<ConfigurationType>>(ConfigService)
  const userTestManger = new UsersTestManager(app, configService)

  await deleteAllData(databaseConnection)

  return {
    app,
    databaseConnection,
    httpServer,
    userTestManger,
    configService,
  }
}
