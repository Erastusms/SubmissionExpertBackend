const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async addCommentHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const commentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await commentUseCase.addNewComment(
      request.payload,
      request.params,
      headerAuthorization
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const commentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const removePayload = {
      ...request.payload,
      ...request.params,
      headerAuthorization
    };
    await commentUseCase.deleteCommentById(removePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
