import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from '../../blogs'
import { PostsTestManager } from './utils/posts-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { LikeStatus } from '../../likes'

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

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = `Added comment to post ${postResponseBody.title}`

    const commentResponse = await postsTestManager.addCommentToPost(accessToken, {
      postId: postResponseBody.id,
      content: comment,
    })

    expect(commentResponse.content).toBe(comment)
    expect(commentResponse.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(commentResponse.likesInfo.likesCount).toBe(0)
    expect(commentResponse.likesInfo.dislikesCount).toBe(0)
  })

  it('should add like to post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    await request(httpSever)
      .put(`/api/posts/${postResponseBody.id}/like-status`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const updatedPost = await postsTestManager.getPostById(accessToken, postResponseBody.id)

    expect(postResponseBody.extendedLikesInfo.likesCount).toBe(0)
    expect(updatedPost.extendedLikesInfo.likesCount).toBe(1)
    expect(updatedPost.extendedLikesInfo.myStatus).toBe(LikeStatus.LIKE)
  })

  it('should throw 400 if passed body is incorrect', async () => {
    const { username, password } = userTestManger.getSaCredits
    const postBody = {
      title: 'valid',
      content: 'valid',
      blogId: '63189b06003380064c4193be',
      shortDescription:
        'length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx',
    }
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postRequestBody, postResponseBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: postBody.blogId, createPostModel: postBody },
      HttpStatusCodes.BAD_REQUEST_400,
    )
  })
})
