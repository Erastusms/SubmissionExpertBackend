class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
    authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async deleteCommentById({ commentId, threadId, headerAuthorization }) {
    const accessToken = await this._authenticationTokenManager.getBearerToken(
      headerAuthorization
    );
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken
    );
    await this._commentRepository.findCommentById(commentId);
    await this._commentRepository.verifyComment({ commentId, owner });
    await this._threadRepository.getDetailThread(threadId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
