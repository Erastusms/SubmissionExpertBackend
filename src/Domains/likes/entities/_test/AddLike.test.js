const AddLike = require('../AddLike');

describe('add Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
    };

    expect(() => new AddLike(payload)).toThrowError(
      'ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 123,
      owner: 'user-123',
    };

    expect(() => new AddLike(payload)).toThrowError(
      'ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create Comment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const { threadId, commentId, owner } = new AddLike(payload);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
