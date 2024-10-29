import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogViewDto } from '../../api/models/output/blog-view.dto'

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpSever = this.app.getHttpServer()
  blogIndex = 0

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

  async createBlog(
    auth: { username: string; password: string },
    blogCreateDto?: CreateBlogDto,
  ): Promise<{ blogRequest: CreateBlogDto; blogResponse: BlogViewDto }> {
    const createBlogDto = blogCreateDto ?? this.getBlogCreateDto

    const response = await request(this.httpSever)
      .post('/api/blogs')
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .send(createBlogDto)
      .expect(HttpStatusCodes.CREATED_201)

    return { blogRequest: createBlogDto, blogResponse: response.body }
  }
}
