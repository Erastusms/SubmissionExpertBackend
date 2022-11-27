class GetDetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId } = payload;
    this.threadId = threadId;
  }

  _verifyPayload({ threadId }) {
    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (threadId.length > 50) {
      throw new Error('GET_DETAIL_THREAD.LIMIT_CHAR');
    }
    
    if (!threadId.startsWith('thread')) {
      throw new Error('GET_DETAIL_THREAD.NOT_VALID');
    }
  }
}

module.exports = GetDetailThread;
