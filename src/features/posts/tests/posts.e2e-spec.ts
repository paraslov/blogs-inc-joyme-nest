import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from '../../blogs'
import { PostsTestManager } from './utils/posts-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'

describe('posts like-statuses', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager
  let httpSever: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      httpSever = result.httpServer

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

  it('should create post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postRequestBody, postResponseBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    postsTestManager.expectCorrectModel(postRequestBody, postResponseBody)
  })

  it('should add comment to post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    const comment = `Added comment to post ${postResponseBody.title}`

    const response = await postsTestManager.addCommentToPost(accessToken, {
      postId: postResponseBody.id,
      content: `Added comment to post ${postResponseBody.title}`,
    })

    expect(response.content).toBe(comment)
    expect(response.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(response.likesInfo.likesCount).toBe(0)
    expect(response.likesInfo.dislikesCount).toBe(0)
  })
})
