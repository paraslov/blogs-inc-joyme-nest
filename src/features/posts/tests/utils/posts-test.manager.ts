import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { INestApplication } from '@nestjs/common'
import { CreatePostDto } from '../../api/models/input/create-post.dto'
import { PostViewDto } from '../../api/models/output/post.view.dto'
import { CommentViewDto } from '../../../comments/api/models/output/comment.view.dto'

export class PostsTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpSever = this.app.getHttpServer()
  postIndex = 0

  private get getPostDto(): Omit<CreatePostDto, 'blogId'> {
    this.postIndex++

    return {
      title: `New Post Title ${this.postIndex}`,
      content: `New post content ${this.postIndex}`,
      shortDescription: `New post short description ${this.postIndex}`,
      likesCount: 0,
      dislikesCount: 0,
    }
  }

  expectCorrectModel(requestBody: CreatePostDto, responseBody: PostViewDto) {
    expect(responseBody.blogId).toBe(requestBody.blogId)
    expect(responseBody.shortDescription).toBe(requestBody.shortDescription)
    expect(responseBody.title).toBe(requestBody.title)
    expect(responseBody.content).toBe(requestBody.content)
    expect(responseBody.extendedLikesInfo.likesCount).toBe(requestBody.likesCount)
    expect(responseBody.extendedLikesInfo.dislikesCount).toBe(requestBody.dislikesCount)
    expect(responseBody.id).toStrictEqual(expect.any(String))
    expect(responseBody.blogName).toStrictEqual(expect.any(String))
  }

  async createPost(
    auth: { username: string; password: string },
    createData: {
      blogId: string
      createPostModel?: CreatePostDto
    },
  ): Promise<{ postRequestBody: CreatePostDto; postResponseBody: PostViewDto }> {
    const createPostDto = createData.createPostModel ?? { ...this.getPostDto, blogId: createData.blogId }

    const response = await request(this.httpSever)
      .post('/api/posts')
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .send(createPostDto)
      .expect(HttpStatusCodes.CREATED_201)

    return { postRequestBody: createPostDto, postResponseBody: response.body }
  }

  async addCommentToPost(
    accessToken: string,
    createData: { postId: string; content: string },
  ): Promise<CommentViewDto> {
    const response = await request(this.httpSever)
      .post(`/api/posts/${createData.postId}/comments`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ content: createData.content })
      .expect(HttpStatusCodes.CREATED_201)

    return response.body
  }
}
