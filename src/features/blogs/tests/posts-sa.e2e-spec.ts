import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { BlogsSqlRepository } from '../infrastructure/blogs.sql-repository'
import { DataSource } from 'typeorm'
import { PostsTestManager } from './utils/posts-test.manager'

describe('>>- posts sa -<<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager
  let blogsSqlRepository: BlogsSqlRepository
  let dataSource: DataSource
  let httpSever: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      dataSource = result.dataSource
      httpSever = result.httpServer

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

  it('should create post for blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody, postRequestBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    postsTestManager.expectCorrectModel(postRequestBody, postResponseBody)
  })

  it('should create post for blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody, postRequestBody } = await postsTestManager.createPost(
      { username, password },
      { blogId: blogResponse.id },
    )

    postsTestManager.expectCorrectModel(postRequestBody, postResponseBody)
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

  it('should get all post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const posts = await postsTestManager.getAllPosts({ username, password }, blogResponse.id)

    expect(posts.totalCount).toBe(5)
    expect(posts.items?.length).toBe(5)
    expect(posts.items?.[0].blogId).toBe(blogResponse.id)
  })
})
