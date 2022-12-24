class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async getDetailThread(payload) {
    const { threadId } = payload;
    await this._threadRepository.verifyThreadAvaibility(threadId);
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    const commentDetail = await this._commentRepository.getDetailComment(
      threadId
    );
    const thread = {
      ...threadDetail,
      comments: [...commentDetail],
    };
    return thread;
  }
}

module.exports = GetDetailThreadUseCase;
