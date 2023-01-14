/* eslint-disable max-len */
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailUseCase', () => {
  it('should orchestrate to get detail thread action correctly', async () => {
    const payloadParams = {
      threadId: 'thread-123',
    };
    const commentId = 'comment-123';

    const expectedDetailThread = new GetDetailThread({
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2022-11-11',
      username: 'New User',
      comments: [
        new GetDetailComment({
          id: 'comment-123',
          content: 'content-test',
          date: '2022-11-11',
          username: 'New User',
          likeCount: 2,
        }),
        new GetDetailComment({
          id: 'comment-321',
          content: '**komentar telah dihapus**',
          date: '2022-11-12',
          username: 'User New',
          likeCount: 2,
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() => Promise.resolve(
      new GetDetailThread({
        id: 'thread-123',
        title: 'New Title',
        body: 'New Body',
        date: '2022-11-11',
        username: 'New User',
        comments: [],
      })
    ));
    mockCommentRepository.getAllCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'content-test',
          date: '2022-11-11',
          username: 'New User',
          is_deleted: false,
          likeCount: 2,
        },
        {
          id: 'comment-321',
          content: 'content-1',
          date: '2022-11-12',
          username: 'User New',
          is_deleted: true,
          likeCount: 0,
        },
      ]));

    mockLikeRepository.getTotalLikesInComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'likes-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
        {
          id: 'likes-321',
          comment_id: 'comment-123',
          owner: 'user-321',
        },
      ]));

    const dummyThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
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
    expect(mockCommentRepository.getAllCommentInThread).toBeCalledWith(
      payloadParams.threadId
    );
    expect(mockLikeRepository.getTotalLikesInComment).toBeCalledWith(commentId);
    expect(detailThread).toStrictEqual(expectedDetailThread);
  });
});
