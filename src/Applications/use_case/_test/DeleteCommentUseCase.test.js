const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('RemoveCommentUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const headerAuthorization = 'Bearer accessToken';
    const accessToken = 'accessToken';
    const ownerId = 'user-123';
    const expectedDeletedComment = {
      id: 'comment-123',
    };

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
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));

    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const removeCommentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    await removeCommentUseCase.deleteCommentById({
      ...useCasePayload,
      headerAuthorization,
    });

    expect(mockAuthenticationTokenManager.getBearerToken).toBeCalledWith(
      headerAuthorization
    );
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(
      accessToken
    );
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      accessToken
    );

    expect(mockCommentRepository.verifyComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      owner: ownerId,
    });
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      expectedDeletedComment.id
    );
  });
});
