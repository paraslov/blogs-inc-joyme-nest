import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { BlogsSqlRepository } from '../infrastructure/blogs.sql-repository'
import { DataSource } from 'typeorm'
import { PostsTestManager } from './utils/posts-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { UpdatePostDto } from '../api/models/input/update-post.dto'

aDescribe(skipSettings.for('posts_sa'))('>> posts_sa <<', () => {
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

  it('should get all post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    await postsTestManager.createSeveralPosts({ username, password }, { blogId: blogResponse.id, postsCount: 5 })

    const posts = await postsTestManager.getAllPosts({ username, password }, blogResponse.id)

    expect(posts.totalCount).toBe(5)
    expect(posts.items?.length).toBe(5)
    expect(posts.items?.[0].blogId).toBe(blogResponse.id)
  })

  it('should update post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })
    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post Title',
      shortDescription: 'Updated Post Short Description',
      content: 'Updated Post Content',
    }

    await request(httpSever)
      .put(`/api/sa/blogs/${blogResponse.id}/posts/${postResponseBody.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .send(updatePostDto)
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const post = await postsTestManager.getPostById(postResponseBody.id)

    expect(post.title).toBe(updatePostDto.title)
    expect(post.content).toBe(updatePostDto.content)
    expect(post.shortDescription).toBe(updatePostDto.shortDescription)
    expect(post.blogId).toBe(blogResponse.id)
    expect(post.id).toBe(postResponseBody.id)
  })

  it('should delete post', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })
    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    await request(httpSever)
      .delete(`/api/sa/blogs/${blogResponse.id}/posts/${postResponseBody.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    await postsTestManager.getPostById(postResponseBody.id, {
      expectedStatus: HttpStatusCodes.NOT_FOUND_404,
    })
  })
})
