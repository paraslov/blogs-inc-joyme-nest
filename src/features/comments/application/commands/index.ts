import { CreateCommentHandler } from './create-comment.command'
import { UpdateCommentHandler } from './update-comment.command'

export const CommentsCommandHandlers = [CreateCommentHandler, UpdateCommentHandler]
