import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'

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

  it('should create blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogRequest, blogResponse } = await blogsTestManager.createBlog({ username, password })

    blogsTestManager.expectCorrectModel(blogRequest, blogResponse)
  })
})
