import { CreateCommentHandler } from './create-comment.command'
import { UpdateCommentHandler } from './update-comment.command'
import { UpdateCommentLikeStatusHandler } from './update-like-status.command'

export const CommentsCommandHandlers = [CreateCommentHandler, UpdateCommentHandler, UpdateCommentLikeStatusHandler]
