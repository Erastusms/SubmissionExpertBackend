const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, commentRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async addNewThread(useCasePayload, headerAuthorization) {
    const accessToken = await this._authenticationTokenManager.getBearerToken(
      headerAuthorization
    );
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken
    );
    const addThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(addThread);
  }

  async getDetailThread(payload) {
    return this._threadRepository.getDetailThread(payload.threadId);
  }
}

module.exports = AddThreadUseCase;
