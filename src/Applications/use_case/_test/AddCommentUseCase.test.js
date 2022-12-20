const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../AddCommentUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const addCommentPayload = new AddComment({
      content: 'content-test',
    });
    const addComentParams = {
      threadId: 'thread-123',
    };
    const addedComment = new AddedComment({
      id: 'comment-123',
      owner: 'user-123',
      content: 'content-test',
    });

    const expectedAddComment = {
      content: addedComment.content,
      owner: addedComment.owner,
      threadId: addComentParams.threadId,
      username: 'testing',
    };

    const headerAuth = 'Bearer accessToken';
    const accessToken = 'accessToken';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationTokenManager.getBearerToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'testing' }));

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddComment));

    const dummyCommentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const addComment = await dummyCommentUseCase.addNewComment(
      addCommentPayload,
      addComentParams,
      headerAuth
    );

    expect(addComment).toStrictEqual(expectedAddComment);
    expect(mockAuthenticationTokenManager.getBearerToken).toBeCalledWith(
      headerAuth
    );
    expect(
      mockAuthenticationTokenManager.verifyAccessToken()
    ).resolves.toBeUndefined();
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      addComentParams.threadId
    );
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      accessToken
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(expectedAddComment);
  });
});
