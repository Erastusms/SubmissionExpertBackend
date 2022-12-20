const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    const useCasePayload = {
      id: 'thread-123',
      title: 'Titanic',
      body: 'Someday i will fly'
    };

    const expectedAddThread = new AddThread({
      ...useCasePayload,
      owner: 'user-123'
    });

    const headerAuthorization = 'Bearer accessToken';
    const accessToken = 'accessToken';

    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddThread));

    mockAuthenticationTokenManager.verifyAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.getBearerToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ username: 'user-123', id: expectedAddThread.owner }));

    const dummyThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const addThread = await dummyThreadUseCase.addNewThread(
      useCasePayload,
      headerAuthorization
    );

    expect(addThread).toStrictEqual(expectedAddThread);
    expect(mockAuthenticationTokenManager.getBearerToken).toBeCalledWith(
      headerAuthorization
    );
    expect(
      mockAuthenticationTokenManager.verifyAccessToken()
    ).resolves.toBeUndefined();
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      accessToken
    );
  });
});
