const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('RemoveCommentUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const owner = 'user-123';
    const expectedDeletedComment = {
      id: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyThreadAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const removeCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await removeCommentUseCase.deleteCommentById({
      ...useCasePayload,
      owner,
    });

    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      owner
    });
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      expectedDeletedComment.id
    );
  });
});
