const AddLike = require('../../../Domains/likes/entities/AddLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLikeOrUnlikeUseCase = require('../AddLikeOrUnlikeUseCase');

describe('AddLikeOrUnlikeUseCase', () => {
  it('should orchestrate the like action correctly', async () => {
    const likesPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddLike = new AddLike({ ...likesPayload });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeComment = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const dummyLikeUseCase = new AddLikeOrUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await dummyLikeUseCase.addLikeOrUnlike({ ...likesPayload });

    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(
      likesPayload.threadId
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      likesPayload.commentId
    );
    expect(mockLikeRepository.isLikeComment).toBeCalledWith(expectedAddLike);
    expect(mockLikeRepository.unlikeComment).toBeCalledWith(expectedAddLike);
  });

  it('should orchestrate the unlike action correctly', async () => {
    const unlikesPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddLike = new AddLike({ ...unlikesPayload });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeComment = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn(() => Promise.resolve());

    const dummyLikeUseCase = new AddLikeOrUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await dummyLikeUseCase.addLikeOrUnlike({ ...unlikesPayload });

    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(
      unlikesPayload.threadId
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      unlikesPayload.commentId
    );
    expect(mockLikeRepository.isLikeComment).toBeCalledWith(expectedAddLike);
    expect(mockLikeRepository.likeComment).toBeCalledWith(expectedAddLike);
  });
});
