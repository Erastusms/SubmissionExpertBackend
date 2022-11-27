const AddThread = require('../../Domains/threads/entities/AddThread');
// const GetDetailThread = require('../../Domains/threads/entities/AddThread');

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
    const addThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(addThread);
  }

//   async getDetailThread(threadId) {
//     await GetDetailThread.verifyAccessToken(accessToken);
//     const { id: owner } = await this._authenticationTokenManager.decodePayload(
//       accessToken
//     );
//     const addThread = new Thread({ ...useCasePayload, owner });
//     return this._threadRepository.addThread(addThread);
//   }
}

module.exports = ThreadUseCase;
