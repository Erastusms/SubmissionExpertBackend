const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const addCommentPayload = {
      content: 'content-test',
    };
    const addComentParams = {
      threadId: 'thread-123',
    };
    const owner = 'user-123';
    const username = 'testing';

    const expectedAddComment = new AddComment({
      content: addCommentPayload.content,
      threadId: addComentParams.threadId,
      owner,
      username,
    });

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      owner: 'user-123',
      content: 'content-test',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: 'content-test',
        owner: 'user-123',
      })
    ));

    const dummyCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await dummyCommentUseCase.addNewComment({
      content: addCommentPayload.content,
      threadId: addComentParams.threadId,
      owner,
      username,
    });

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(expectedAddComment);
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(addComentParams.threadId);
  });
});
