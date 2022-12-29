const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread');
const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async getDetailThread(payload) {
    const { threadId } = payload;
    await this._threadRepository.verifyThreadAvaibility(threadId);
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    const commentDetail = await this._commentRepository.getAllCommentInThread(
      threadId
    );
    const thread = new GetDetailThread({
      ...threadDetail,
      comments: commentDetail.map((comment) => new GetDetailComment({
        ...comment,
        content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
      })),
    });
    return thread;
  }
}

module.exports = GetDetailThreadUseCase;
