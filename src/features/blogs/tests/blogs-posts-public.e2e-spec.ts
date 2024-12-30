import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { DataSource } from 'typeorm'
import { PostsTestManager } from './utils/posts-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { LikeStatus } from '../../likes'

aDescribe(skipSettings.for('blogs_posts_public'))('>> blogs_posts_public <<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager
  let dataSource: DataSource
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      dataSource = result.dataSource
      httpServer = result.httpServer

      blogsTestManager = new BlogsTestManager(app)
      postsTestManager = new PostsTestManager(app)
    } catch (err) {
      console.log('posts tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get created post through posts controller', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })
    const { postResponseBody, postRequestBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    const post = await postsTestManager.getPostById(postResponseBody.id)

    postsTestManager.expectCorrectModel(postRequestBody, post)
  })

  it('should get all post through posts controller "/posts"', async () => {
    await dataSource.query('DELETE FROM public.posts;')

    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createSeveralPosts({ username, password }, { blogId: blogResponse.id, postsCount: 4 })

    const response = await request(httpServer).get(`/api/posts`).expect(HttpStatusCodes.OK_200)

    expect(response.body.totalCount).toBe(5)
    expect(response.body.items?.length).toBe(5)
    expect(response.body.items?.some((item: any) => item.id === postResponseBody.id)).toBeTruthy()
  })

  it('should get all blogs', async () => {
    await dataSource.query('DELETE FROM public.posts;')
    await dataSource.query('DELETE FROM public.blogs;')

    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })
    await blogsTestManager.createSeveralBlogs({ username, password }, { blogsCount: 4 })

    const response = await request(httpServer).get('/api/blogs').expect(HttpStatusCodes.OK_200)

    expect(response.body.totalCount).toBe(5)
    expect(response.body.items?.length).toBe(5)
    expect(response.body.items?.some((item: any) => item.id === blogResponse.id)).toBeTruthy()
  })

  it('should get all blogs with pagination', async () => {
    await dataSource.query('DELETE FROM public.posts;')
    await dataSource.query('DELETE FROM public.blogs;')
    blogsTestManager.resetIndex()

    const { username, password } = userTestManger.getSaCredits
    await blogsTestManager.createSeveralBlogs({ username, password }, { blogsCount: 12 })

    const response = await request(httpServer)
      .get('/api/blogs')
      .query({ pageSize: 3, pageNumber: 3 })
      .expect(HttpStatusCodes.OK_200)

    expect(response.body.totalCount).toBe(12)
    expect(response.body.items?.length).toBe(3)
    expect(response.body.items[0].name).toBe('Blog Name 6')
    expect(response.body.items[1].name).toBe('Blog Name 5')
    expect(response.body.items[2].name).toBe('Blog Name 4')
  })

  it('should get blogs by id', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const response = await request(httpServer).get(`/api/blogs/${blogResponse.id}`).expect(HttpStatusCodes.OK_200)

    expect(blogResponse.id).toBe(response.body.id)
    expect(blogResponse.name).toBe(response.body.name)
    expect(blogResponse.websiteUrl).toBe(response.body.websiteUrl)
  })

  it('should get all post through blogs controller "/blogs/:blogId/posts"', async () => {
    await dataSource.query('DELETE FROM public.posts;')

    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createSeveralPosts({ username, password }, { blogId: blogResponse.id, postsCount: 4 })

    const response = await request(httpServer).get(`/api/blogs/${blogResponse.id}/posts`).expect(HttpStatusCodes.OK_200)

    expect(response.body.totalCount).toBe(5)
    expect(response.body.items?.length).toBe(5)
    expect(response.body.items?.some((item: any) => item.id === postResponseBody.id)).toBeTruthy()
  })

  it('should create comment to post: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })

    expect(comment.id).toStrictEqual(expect.any(String))
    expect(comment.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(comment.commentatorInfo.userLogin).toBe(userResponseBody.login)
    expect(comment.likesInfo.myStatus).toBe(LikeStatus.NONE)
  })

  it('should get post comment: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })
    const fetchComments = await postsTestManager.getPostsComments(accessToken, postResponseBody.id)
    const newComment = fetchComments.items?.[0]

    expect(newComment.id).toBe(comment.id)
    expect(newComment.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(newComment.commentatorInfo.userLogin).toBe(userResponseBody.login)
    expect(newComment.likesInfo.myStatus).toBe(LikeStatus.NONE)
  })

  it('should add like to post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    await request(httpServer)
      .put(`/api/posts/${postResponseBody.id}/like-status`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const updatedPost = await postsTestManager.getPostById(postResponseBody.id, { accessToken })

    expect(postResponseBody.extendedLikesInfo.likesCount).toBe(0)
    expect(postResponseBody.extendedLikesInfo.newestLikes.length).toBe(0)
    expect(updatedPost.extendedLikesInfo.likesCount).toBe(1)
    expect(updatedPost.extendedLikesInfo.myStatus).toBe(LikeStatus.LIKE)
    expect(updatedPost.extendedLikesInfo.newestLikes.length).toBe(1)
    expect(updatedPost.extendedLikesInfo.newestLikes?.[0].userId).toBe(userResponseBody.id)
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
    await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost<any>(
      { username, password },
      { blogId: postBody.blogId, createPostModel: postBody },
      HttpStatusCodes.BAD_REQUEST_400,
    )

    expect(postResponseBody.errorsMessages.some((message: any) => message.field === 'shortDescription')).toBeTruthy()
  })
})
