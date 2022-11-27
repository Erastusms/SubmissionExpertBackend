const Thread = require('../../Domains/threads/entities/Thread');

class ThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
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
    const addThread = new Thread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = ThreadUseCase;
