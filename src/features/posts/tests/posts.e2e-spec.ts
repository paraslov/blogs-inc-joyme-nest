import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from '../../blogs'
import { PostsTestManager } from './utils/posts-test.manager'

describe('posts', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app

      userTestManger = result.userTestManger
      blogsTestManager = new BlogsTestManager(app)
      postsTestManager = new PostsTestManager(app)
    } catch (err) {
      console.log('@> posts tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { requestBody, responseBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    postsTestManager.expectCorrectModel(requestBody, responseBody)
  })
})
