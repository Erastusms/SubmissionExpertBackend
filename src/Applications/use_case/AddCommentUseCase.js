/* eslint-disable max-len */
const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
    authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async addNewComment(useCasePayload, useCaseParam, headerAuthorization) {
    const addComment = new AddComment({ ...useCasePayload });
    const accessToken = await this._authenticationTokenManager.getBearerToken(
      headerAuthorization
    );
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner, username } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._threadRepository.getDetailThread(useCaseParam.threadId);
    const addComentPayload = {
      threadId: useCaseParam.threadId,
      username,
      content: addComment.content,
      owner,
    };
    return this._commentRepository.addComment(addComentPayload);
  }
}

module.exports = AddCommentUseCase;
