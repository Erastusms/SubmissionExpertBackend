/* eslint-disable object-curly-newline */
class GetDetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, date, username, content, likeCount } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
    this.likeCount = likeCount;
  }

  _verifyPayload(payload) {
    const { id, date, username, content, likeCount } = payload;
    if (!id || !date || !username || !content || likeCount < 0) {
      throw new Error('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailComment;
