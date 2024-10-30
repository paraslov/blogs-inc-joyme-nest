import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { BlogsTestManager } from '../../blogs'
import { initTestsSettings } from '../../../common/tests'

describe('blogs', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger

      blogsTestManager = new BlogsTestManager(app)
    } catch (err) {
      console.log('@> blogs tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })
})
