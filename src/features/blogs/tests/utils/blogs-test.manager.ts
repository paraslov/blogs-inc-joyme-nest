import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogViewDto } from '../../api/models/output/blog-view.dto'
import { PaginatedOutputEntity } from '../../../../common/models/output/Pagination'

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  private httpSever = this.app.getHttpServer()
  private blogIndex = 0

  private get getBlogCreateDto(): CreateBlogDto {
    this.blogIndex++

    return {
      name: `Blog Name ${this.blogIndex}`,
      description: `New Blog Description ${this.blogIndex}`,
      websiteUrl: `https://blog-site${this.blogIndex}.bol`,
    }
  }

  public resetIndex() {
    this.blogIndex = 0
  }

  expectCorrectModel(blogRequest: CreateBlogDto, blogResponse: BlogViewDto) {
    expect(blogResponse.name).toBe(blogRequest.name)
    expect(blogResponse.description).toBe(blogRequest.description)
    expect(blogResponse.websiteUrl).toBe(blogRequest.websiteUrl)
    expect(blogResponse.id).toStrictEqual(expect.any(String))
  }

  async createBlog<T = BlogViewDto>(
    auth: { username: string; password: string },
    blogCreateDto?: CreateBlogDto,
    expectedStatus: HttpStatusCodes = HttpStatusCodes.CREATED_201,
  ): Promise<{ blogRequest: CreateBlogDto; blogResponse: T }> {
    const createBlogDto = blogCreateDto ?? this.getBlogCreateDto

    const response = await request(this.httpSever)
      .post('/api/sa/blogs')
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .send(createBlogDto)
      .expect(expectedStatus)

    return { blogRequest: createBlogDto, blogResponse: response.body }
  }

  createSeveralBlogs(auth: { username: string; password: string }, createData: { blogsCount: number }) {
    const arr = Array(createData.blogsCount).fill(0)

    const tasks = arr.map(() => () => this.createBlog(auth))
    return this.executeInBatches(4, tasks)
  }

  async getAllBlogs(
    auth: { username: string; password: string },
    expectedStatus: HttpStatusCodes = HttpStatusCodes.OK_200,
  ): Promise<PaginatedOutputEntity<BlogViewDto[]>> {
    const response = await request(this.httpSever)
      .get('/api/sa/blogs')
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .expect(expectedStatus)

    return response.body
  }

  async getBlogById<T = BlogViewDto>(
    blogId: string,
    expectedStatus: HttpStatusCodes = HttpStatusCodes.OK_200,
  ): Promise<T> {
    const response = await request(this.httpSever).get(`/api/blogs/${blogId}`).expect(expectedStatus)

    return response.body
  }

  async executeInBatches(batchSize: number, tasks: (() => Promise<any>)[]) {
    const results = []
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((task) => task()))
      results.push(...batchResults)
    }
    return results
  }
}
