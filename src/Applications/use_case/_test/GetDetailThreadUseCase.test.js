const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../AddThreadUseCase');

describe('GetDetailUseCase', () => {
  it('should orchestrate to get detail thread action correctly', async () => {
    const payloadParams = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = new GetDetailThread({
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2022-11-11',
      username: 'New User',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));

    const dummyThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const detailThread = await dummyThreadUseCase.getDetailThread(
      payloadParams
    );

    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(payloadParams.threadId);
  });
});
