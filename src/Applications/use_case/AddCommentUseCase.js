const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addNewComment(payload) {
    await this._threadRepository.verifyThreadAvaibility(payload.threadId);
    return this._commentRepository.addComment(new AddComment({ ...payload }));
  }
}

module.exports = AddCommentUseCase;
