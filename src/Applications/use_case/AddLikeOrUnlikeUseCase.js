const AddLike = require('../../Domains/likes/entities/AddLike');

class AddLikeOrUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async addLikeOrUnlike(payload) {
    const AddLikePayload = new AddLike({ ...payload });
    const { threadId, commentId } = AddLikePayload;
    await this._threadRepository.verifyThreadAvaibility(threadId);
    await this._commentRepository.findCommentById(commentId);
    const isLikeComment = await this._likeRepository.isLikeComment(
      AddLikePayload
    );
    if (isLikeComment) return this._likeRepository.unlikeComment(AddLikePayload);
    return this._likeRepository.likeComment(AddLikePayload);
  }
}

module.exports = AddLikeOrUnlikeUseCase;
