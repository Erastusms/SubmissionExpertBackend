const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addNewThread(useCasePayload, owner) {
    const addThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(addThread);
  }

  async getDetailThread(payload) {
    return this._threadRepository.getDetailThread(payload.threadId);
  }
}

module.exports = AddThreadUseCase;
