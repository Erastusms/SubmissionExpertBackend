const GetDetailThread = require('../GetDetailThread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'THR-312',
      title: 'New Title'
    };
    expect(() => new GetDetailThread(payload)).toThrowError(
      'GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const falseThreadId = {
      id: 123,
      title: 'New Title',
      body: 'New Body',
      date: '2022-11-11',
      username: 'New User',
      comments: [],
    };
    expect(() => new GetDetailThread(falseThreadId)).toThrowError(
      'GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should get detail Thread correctly', () => {
    const expectedDetailThread = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2022-11-11',
      username: 'New User',
      comments: [],
    };

    const { id, title, body, date, username, comments } = new GetDetailThread(expectedDetailThread);
    expect(id).toEqual(expectedDetailThread.id);
    expect(title).toEqual(expectedDetailThread.title);
    expect(body).toEqual(expectedDetailThread.body);
    expect(date).toEqual(expectedDetailThread.date);
    expect(username).toEqual(expectedDetailThread.username);
    expect(comments).toEqual(expectedDetailThread.comments);
  });
});
