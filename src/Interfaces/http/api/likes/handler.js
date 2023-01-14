const AddLikeOrUnlikeUseCase = require('../../../../Applications/use_case/AddLikeOrUnlikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.likeUnlikeHandler = this.likeUnlikeHandler.bind(this);
  }

  async likeUnlikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeUnlikeUseCase = this._container.getInstance(
      AddLikeOrUnlikeUseCase.name
    );
    const addLikePayload = {
      threadId,
      commentId,
      owner,
    };
    await likeUnlikeUseCase.addLikeOrUnlike(addLikePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
