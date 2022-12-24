class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async deleteCommentById({ commentId, threadId, owner }) {
    await this._commentRepository.findCommentById(commentId);
    await this._commentRepository.verifyComment({ commentId, owner });
    await this._threadRepository.verifyThreadAvaibility(threadId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
