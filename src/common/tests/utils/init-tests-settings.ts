import { Test, TestingModuleBuilder } from '@nestjs/testing'

import { deleteAllData } from './delete-all-data'
import { UsersTestManager } from '../../../features/users'
import configuration, { ConfigurationType } from '../../../settings/configuration'
import { AppModule } from '../../../app.module'
import { applyAppSettings } from '../../../settings/apply.app.settings'
import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

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

  const dataSource = app.get<DataSource>(DataSource)
  const httpServer = app.getHttpServer()
  const configService = app.get<ConfigService<ConfigurationType>>(ConfigService)
  // await createTablesIfNeeded(dataSource)
  const userTestManger = new UsersTestManager(app, configService)

  await deleteAllData(dataSource)

  return {
    app,
    dataSource,
    httpServer,
    userTestManger,
    configService,
  }
}
