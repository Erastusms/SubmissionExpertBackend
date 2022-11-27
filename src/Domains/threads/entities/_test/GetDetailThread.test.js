const GetDetailThread = require('../GetDetailThread');

describe('a Thread entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    const falseThreadId = {
      threadId: 123,
    };
    expect(() => new GetDetailThread(falseThreadId)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when threadId contains more than 50 character', () => {
    const more50CharThreadId = {
      threadId: 'thread-qwertiop1234560zxnmmclsjdkorrrwjeokqwnmasodkl',
    };
    expect(() => new GetDetailThread(more50CharThreadId)).toThrowError(
      'GET_DETAIL_THREAD.LIMIT_CHAR'
    );
  });

  it('should throw error when threadId is not valid', () => {
    const notValidThreadId = {
      threadId: 'not-thread-123',
    };
    expect(() => new GetDetailThread(notValidThreadId)).toThrowError(
      'GET_DETAIL_THREAD.NOT_VALID'
    );
  });

  it('should get detail Thread Id correctly', () => {
    const expectedThreadId = {
      threadId: 'thread-123',
    };
    const ThreadId = new GetDetailThread(expectedThreadId);
    expect(ThreadId).toEqual(expectedThreadId);
  });
});
