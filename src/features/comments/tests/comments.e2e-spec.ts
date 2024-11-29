import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { BlogsTestManager, PostsTestManager } from '../../blogs'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import { CommentsTestManager } from './utils/comments-test.manager'
import { LikeStatus } from '../../likes'
import { CommentsSqlRepository } from '../infrastructure/comments.sql-repository'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'

aDescribe(skipSettings.for('comments'))('>> comments <<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let blogsTestManager: BlogsTestManager
  let postsTestManager: PostsTestManager
  let commentsTestManager: CommentsTestManager
  let commentsRepository: CommentsSqlRepository
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      httpServer = result.httpServer

      blogsTestManager = new BlogsTestManager(app)
      postsTestManager = new PostsTestManager(app)
      commentsTestManager = new CommentsTestManager(app)

      commentsRepository = new CommentsSqlRepository(result.dataSource)
      await commentsRepository.createCommentsTable()
    } catch (err) {
      console.log('@> comments tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create comment: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })

    expect(comment.id).toStrictEqual(expect.any(String))
    expect(comment.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(comment.commentatorInfo.userLogin).toBe(userResponseBody.login)
    expect(comment.likesInfo.myStatus).toBe(LikeStatus.NONE)
  })

  it('should get comment from comments controller: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })
    const fetchedComment = await commentsTestManager.getCommentById(accessToken, comment.id)

    expect(fetchedComment.id).toBe(comment.id)
    expect(fetchedComment.commentatorInfo.userId).toBe(userResponseBody.id)
    expect(fetchedComment.commentatorInfo.userLogin).toBe(userResponseBody.login)
    expect(fetchedComment.likesInfo.myStatus).toBe(LikeStatus.NONE)
  })

  it('should update comment: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })
    const commentContent = 'Updated comment content'
    await request(httpServer)
      .put(`/api/comments/${comment.id}`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ content: commentContent })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const fetchedComment = await commentsTestManager.getCommentById(accessToken, comment.id)

    expect(fetchedComment.id).toBe(comment.id)
    expect(fetchedComment.content).toBe(commentContent)
  })

  it('should delete comment: ', async () => {
    const { username, password } = userTestManger.getSaCredits
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()
    const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
    const { blogResponse } = await blogsTestManager.createBlog({ username, password })

    const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })

    const comment = await postsTestManager.addCommentToPost(accessToken, { postId: postResponseBody.id })
    await request(httpServer)
      .delete(`/api/comments/${comment.id}`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const fetchedComment = await commentsTestManager.getCommentById(accessToken, comment.id, {
      expectedStatus: HttpStatusCodes.NOT_FOUND_404,
    })

    expect(fetchedComment.id).toBe(undefined)
  })

  // it('should correctly add like statuses to post comments: ', async () => {
  //   const { username, password } = userTestManger.getSaCredits
  //   const { userRequestBody, userResponseBody } = await userTestManger.createUser()
  //   const { accessToken } = await UsersTestManager.login(app, userResponseBody.login, userRequestBody.password)
  //   const { blogResponse } = await blogsTestManager.createBlog({ username, password })
  //
  //   const { postResponseBody } = await postsTestManager.createPost({ username, password }, { blogId: blogResponse.id })
  //
  //   const commentsData = await postsTestManager.addSeveralCommentsToPost(accessToken, {
  //     postId: postResponseBody.id,
  //     commentsCount: 6,
  //   })
  //   const usersData = await userTestManger.createSeveralUsers(3)
  //
  //   const authUserOne = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
  //   const authUserTwo = await UsersTestManager.login(
  //     app,
  //     usersData[0].userRequestBody.login,
  //     usersData[0].userRequestBody.password,
  //   )
  //   const authUserThree = await UsersTestManager.login(
  //     app,
  //     usersData[1].userRequestBody.login,
  //     usersData[1].userRequestBody.password,
  //   )
  //   const authUserFour = await UsersTestManager.login(
  //     app,
  //     usersData[2].userRequestBody.login,
  //     usersData[2].userRequestBody.password,
  //   )
  //
  //   // step 1
  //   await commentsTestManager.updateCommentLikeStatus(authUserOne.accessToken, {
  //     commentId: commentsData[0].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserTwo.accessToken, {
  //     commentId: commentsData[0].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   // step 2
  //   await commentsTestManager.updateCommentLikeStatus(authUserTwo.accessToken, {
  //     commentId: commentsData[1].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserThree.accessToken, {
  //     commentId: commentsData[1].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   // step 3
  //   await commentsTestManager.updateCommentLikeStatus(authUserOne.accessToken, {
  //     commentId: commentsData[2].id,
  //     likeStatus: LikeStatus.DISLIKE,
  //   })
  //   // step 4
  //   await commentsTestManager.updateCommentLikeStatus(authUserOne.accessToken, {
  //     commentId: commentsData[3].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserTwo.accessToken, {
  //     commentId: commentsData[3].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserThree.accessToken, {
  //     commentId: commentsData[3].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserFour.accessToken, {
  //     commentId: commentsData[3].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   // step 5
  //   await commentsTestManager.updateCommentLikeStatus(authUserTwo.accessToken, {
  //     commentId: commentsData[4].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserThree.accessToken, {
  //     commentId: commentsData[4].id,
  //     likeStatus: LikeStatus.DISLIKE,
  //   })
  //   // step 6
  //   await commentsTestManager.updateCommentLikeStatus(authUserOne.accessToken, {
  //     commentId: commentsData[5].id,
  //     likeStatus: LikeStatus.LIKE,
  //   })
  //   await commentsTestManager.updateCommentLikeStatus(authUserTwo.accessToken, {
  //     commentId: commentsData[5].id,
  //     likeStatus: LikeStatus.DISLIKE,
  //   })
  //
  //   const updatedComments = await postsTestManager.getPostsComments(authUserOne.accessToken, postResponseBody.id)
  //   const commentOne = updatedComments.items.find((comment) => comment.id === commentsData[0].id)
  //   const userLikesStatuses = updatedComments.items.reduce(
  //     (acc, comment) => {
  //       if (comment.likesInfo.myStatus === LikeStatus.LIKE) {
  //         acc.likes++
  //       } else if (comment.likesInfo.myStatus === LikeStatus.DISLIKE) {
  //         acc.dislikes++
  //       } else {
  //         acc.none++
  //       }
  //
  //       return acc
  //     },
  //     { likes: 0, dislikes: 0, none: 0 },
  //   )
  //
  //   expect(userLikesStatuses.likes).toBe(3)
  //   expect(userLikesStatuses.dislikes).toBe(1)
  //   expect(userLikesStatuses.none).toBe(2)
  //   expect(commentOne.likesInfo.myStatus).toBe(LikeStatus.LIKE)
  //   expect(commentOne.likesInfo.likesCount).toBe(2)
  //   expect(commentOne.likesInfo.dislikesCount).toBe(0)
  // })
})
