import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { BlogsSqlRepository } from '../infrastructure/blogs.sql-repository'
import { DataSource } from 'typeorm'
import { PostsTestManager } from './utils/posts-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'

aDescribe(skipSettings.for('blogs_posts_public'))('>> blogs_posts_public <<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager
  let blogsSqlRepository: BlogsSqlRepository
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

      blogsSqlRepository = new BlogsSqlRepository(dataSource)
      await blogsSqlRepository.createBlogsTable()
    } catch (err) {
      console.log('@> posts tests error: ', err)
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
})
