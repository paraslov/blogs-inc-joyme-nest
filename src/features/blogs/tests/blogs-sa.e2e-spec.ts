import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { BlogsTestManager } from './utils/blogs-test.manager'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { HttpStatusCodes } from '../../../common/models'
import { BlogsSqlRepository } from '../infrastructure/blogs.sql-repository'
import { DataSource } from 'typeorm'

describe('>>- blogs sa -<<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let blogsSqlRepository: BlogsSqlRepository
  let dataSource: DataSource

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      dataSource = result.dataSource

      blogsTestManager = new BlogsTestManager(app)

      blogsSqlRepository = new BlogsSqlRepository(dataSource)
      await blogsSqlRepository.createBlogsTable()
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
})
