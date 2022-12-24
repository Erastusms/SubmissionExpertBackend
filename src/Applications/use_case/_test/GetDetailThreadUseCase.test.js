const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailUseCase', () => {
  it('should orchestrate to get detail thread action correctly', async () => {
    const payloadParams = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2022-11-11',
      username: 'New User',
      comments: [
        new GetDetailComment({
          id: 'thread-123',
          content: 'content-test',
          date: '2022-11-11',
          username: 'New User',
        }),
        new GetDetailComment({
          id: 'thread-123',
          content: 'content-1',
          date: '2022-11-12',
          username: 'User New',
        }),
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() => Promise.resolve(
      new GetDetailThread({
        id: 'thread-123',
        title: 'New Title',
        body: 'New Body',
        date: '2022-11-11',
        username: 'New User',
      })
    ));
    mockCommentRepository.getDetailComment = jest.fn().mockImplementation(() => Promise.resolve([
      new GetDetailComment({
        id: 'thread-123',
        content: 'content-test',
        date: '2022-11-11',
        username: 'New User',
      }),
      new GetDetailComment({
        id: 'thread-123',
        content: 'content-1',
        date: '2022-11-12',
        username: 'User New',
      }),
    ]));

    const dummyThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await dummyThreadUseCase.getDetailThread(
      payloadParams
    );

    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(
      payloadParams.threadId
    );
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      payloadParams.threadId
    );
    expect(mockCommentRepository.getDetailComment).toBeCalledWith(
      payloadParams.threadId
    );
    expect(detailThread).toStrictEqual(expectedDetailThread);
  });
});
