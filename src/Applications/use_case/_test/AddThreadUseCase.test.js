const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'Titanic',
      body: 'Someday i will fly',
      owner: 'James-123',
    };

    const expectedAddThread = new AddThread({
      id: 'thread-123',
      ...useCasePayload
    });

    const headerAuthorization = 'Bearer accessToken';
    const accessToken = 'accessToken';

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /* mocking needed function */
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
      .mockImplementation(() => Promise.resolve({ username: 'JamesGun', id: expectedAddThread.owner }));

    /* creating use case instance */
    const dummyThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // action
    const addThread = await dummyThreadUseCase.addNewThread(
      useCasePayload,
      headerAuthorization
    );

    // assert
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
