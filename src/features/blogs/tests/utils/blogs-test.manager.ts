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
      name: `New Blog Name ${this.blogIndex}`,
      description: `New Blog Description ${this.blogIndex}`,
      websiteUrl: `https://blog-site${this.blogIndex}.bol`,
    }
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
}
