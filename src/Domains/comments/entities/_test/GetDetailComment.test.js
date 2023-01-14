const GetDetailComment = require('../GetDetailComment');

describe('a Detail Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'Comment-312',
      date: '2022',
      username: 'user-123',
    };
    expect(() => new GetDetailComment(payload)).toThrowError(
      'GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const falseCommentId = {
      id: 123,
      date: '2022-11-11',
      username: 'New User',
      content: 'content-123',
      likeCount: 2,
    };
    expect(() => new GetDetailComment(falseCommentId)).toThrowError(
      'GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should get detailComment correctly', () => {
    const expectedDetailComment = {
      id: 'Comment-123',
      date: '2022-11-11',
      username: 'New User',
      content: 'content-123',
      likeCount: 2,
    };

    const { id, date, username, content, likeCount } = new GetDetailComment(
      expectedDetailComment
    );
    expect(id).toEqual(expectedDetailComment.id);
    expect(date).toEqual(expectedDetailComment.date);
    expect(username).toEqual(expectedDetailComment.username);
    expect(content).toEqual(expectedDetailComment.content);
    expect(likeCount).toEqual(expectedDetailComment.likeCount);
  });
});
