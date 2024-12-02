import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { HttpStatusCodes } from '../../../common/models'
import { DataSource } from 'typeorm'
import request from 'supertest'

aDescribe(skipSettings.for('blogs_sa'))('>> blogs_sa <<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
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

  it('should get all blogs', async () => {
    await dataSource.query('DELETE FROM public.blogs;')

    const { username, password } = userTestManger.getSaCredits
    await blogsTestManager.createBlog({ username, password })
    await blogsTestManager.createBlog({ username, password })
    await blogsTestManager.createBlog({ username, password })

    const blogsData = await blogsTestManager.getAllBlogs({ username, password })

    expect(blogsData.totalCount).toBe(3)
    expect(blogsData.pageSize).toBe(10)
    expect(blogsData.pagesCount).toBe(1)
    expect(blogsData.items?.length).toBe(3)
  })

  it('should return 400 with name with only spaces', async () => {
    const { username, password } = userTestManger.getSaCredits
    const createBlogDto: CreateBlogDto = {
      name: `     `,
      description: `New Blog Description`,
      websiteUrl: `https://blog-site.bold`,
    }
    const { blogResponse } = await blogsTestManager.createBlog<any>(
      { username, password },
      createBlogDto,
      HttpStatusCodes.BAD_REQUEST_400,
    )

    expect(blogResponse.errorsMessages[0].field).toBe('name')
    expect(blogResponse.errorsMessages[0].message).toStrictEqual(expect.any(String))
  })

  it('should update existed blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })
    const updateBlogDto: CreateBlogDto = {
      name: 'Updated Name',
      description: `Updated Blog Description`,
      websiteUrl: `https://blog-site.bold`,
    }

    const blogBeforeUpdate = await blogsTestManager.getBlogById(blogResponse.id)

    await request(httpSever)
      .put(`/api/sa/blogs/${blogResponse.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .send(updateBlogDto)
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const updatedBlog = await blogsTestManager.getBlogById(blogResponse.id)

    expect(updatedBlog.name).toBe(updateBlogDto.name)
    expect(updatedBlog.description).toBe(updateBlogDto.description)
    expect(updatedBlog.websiteUrl).toBe(updateBlogDto.websiteUrl)
    expect(updatedBlog.name === blogBeforeUpdate.name).toBeFalsy()
  })

  it('should delete existing blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    await request(httpSever)
      .delete(`/api/sa/blogs/${blogResponse.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    await blogsTestManager.getBlogById<any>(blogResponse.id, HttpStatusCodes.NOT_FOUND_404)
  })

  it('should throw 404 if blog id not found while deleting', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    await request(httpSever)
      .delete(`/api/sa/blogs/${blogResponse.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    await request(httpSever)
      .delete(`/api/sa/blogs/${blogResponse.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NOT_FOUND_404)

    await blogsTestManager.getBlogById<any>(blogResponse.id, HttpStatusCodes.NOT_FOUND_404)
  })

  it('should throw 401 if no auth while deleting blog', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    await request(httpSever).delete(`/api/sa/blogs/${blogResponse.id}`).expect(HttpStatusCodes.UNAUTHORIZED_401)
    await blogsTestManager.getBlogById(blogResponse.id, HttpStatusCodes.OK_200)
  })
})
