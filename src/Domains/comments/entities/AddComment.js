class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner, username } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
    this.username = username;
  }

  _verifyPayload({ content, threadId, owner, username }) {
    if (!content || !threadId || !owner || !username) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof owner !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
