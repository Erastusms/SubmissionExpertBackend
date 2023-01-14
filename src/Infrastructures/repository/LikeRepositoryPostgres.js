const { isEmpty } = require('lodash');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isLikeComment(payload) {
    const { commentId, owner } = payload;
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows[0])) return false;
    return true;
  }

  async likeComment(payload) {
    const { commentId, owner } = payload;
    const id = `likes-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };
    await this._pool.query(query);
  }

  async unlikeComment(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    await this._pool.query(query);
  }

  async getTotalLikesInComment(commentId) {
    const query = {
      text: 'SELECT * FROM likes where comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
