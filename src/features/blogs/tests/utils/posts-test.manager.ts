import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { CommentViewDto } from '../../../comments'
import { PostViewDto } from '../../api/models/output/post.view.dto'
import { CreatePostDto } from '../../api/models/input/create-post.dto'
import { HttpStatusCodes } from '../../../../common/models'
import { PaginatedOutputEntity } from '../../../../common/models/output/Pagination'

export class PostsTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpServer = this.app.getHttpServer()
  postIndex = 0
  commentIndex = 0

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
  private get getCommentText() {
    this.commentIndex++

    return `Comment content #${this.commentIndex} to post #`
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

  async getPostById(
    postId: string,
    options: { accessToken?: string | null; expectedStatus?: HttpStatusCodes } = {},
  ): Promise<PostViewDto> {
    const { accessToken = null, expectedStatus = HttpStatusCodes.OK_200 } = options
    const requestBuilder = request(this.httpServer).get(`/api/posts/${postId}`)

    if (accessToken) {
      requestBuilder.auth(accessToken, { type: 'bearer' })
    }
    const response = await requestBuilder.expect(expectedStatus)

    return response.body
  }

  async getAllPosts(
    auth: { username: string; password: string },
    blogId: string,
  ): Promise<PaginatedOutputEntity<PostViewDto[]>> {
    const response = await request(this.httpServer)
      .get(`/api/sa/blogs/${blogId}/posts`)
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.OK_200)

    return response.body
  }

  async getPostsComments(accessToken: string, postId: string): Promise<{ items: CommentViewDto[] }> {
    const response = await request(this.httpServer)
      .get(`/api/posts/${postId}/comments`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(HttpStatusCodes.OK_200)

    return response.body
  }

  async createPost<T = PostViewDto>(
    auth: { username: string; password: string },
    createData: {
      blogId: string
      createPostModel?: CreatePostDto
    },
    expectedStatus: HttpStatusCodes = HttpStatusCodes.CREATED_201,
  ): Promise<{ postRequestBody: CreatePostDto; postResponseBody: T }> {
    const createPostDto = createData.createPostModel ?? { ...this.getPostDto, blogId: createData.blogId }

    const response = await request(this.httpServer)
      .post(`/api/sa/blogs/${createData.blogId}/posts`)
      .auth(auth.username, auth.password, {
        type: 'basic',
      })
      .send(createPostDto)
      .expect(expectedStatus)

    return { postRequestBody: createPostDto, postResponseBody: response.body }
  }

  async createSeveralPosts(
    auth: { username: string; password: string },
    createData: {
      blogId: string
      postsCount: number
    },
  ) {
    const arr = Array(createData.postsCount).fill(0)

    const promises = arr.map(async () => {
      return await this.createPost(auth, { blogId: createData.blogId })
    })

    return Promise.all(promises)
  }

  async addCommentToPost(
    accessToken: string,
    createData: { postId: string; content?: string },
  ): Promise<CommentViewDto> {
    const commentContent = createData.content ?? `${this.getCommentText}${createData.postId}`

    const response = await request(this.httpServer)
      .post(`/api/posts/${createData.postId}/comments`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ content: commentContent })
      .expect(HttpStatusCodes.CREATED_201)

    return response.body
  }

  async addSeveralCommentsToPost(assessToken: string, createData: { commentsCount: number; postId: string }) {
    const arr = Array(createData.commentsCount).fill(0)

    const promises = arr.map(async () => {
      return await this.addCommentToPost(assessToken, { postId: createData.postId })
    })

    return Promise.all(promises)
  }
}
