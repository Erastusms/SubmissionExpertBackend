/* eslint-disable max-len */
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread');
const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async getDetailThread(payload) {
    const { threadId } = payload;
    await this._threadRepository.verifyThreadAvaibility(threadId);
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    const commentDetail = await this._commentRepository.getAllCommentInThread(
      threadId
    );
    return new GetDetailThread({
      ...threadDetail,
      comments: await Promise.all(
        commentDetail.map(async (comment) => {
          const totalLikes = await this._likeRepository.getTotalLikesInComment(
            comment.id
          );
          return new GetDetailComment({
            ...comment,
            content: comment.is_deleted
              ? '**komentar telah dihapus**'
              : comment.content,
            likeCount: totalLikes.length,
          });
        })
      ),
    });
  }
}

module.exports = GetDetailThreadUseCase;
