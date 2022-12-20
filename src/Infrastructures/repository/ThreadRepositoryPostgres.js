const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner, date = '2022' } = payload;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async getDetailThread(threadId) {
    const query = {
      text: `SELECT thr.id, thr.title, thr.body, thr.date, u.username 
              FROM threads thr
              INNER JOIN users u ON thr.owner = u.id
              WHERE thr.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Thread');

    return new GetDetailThread({ ...result.rows[0] });
  }

  // async removeThread(threadId) {
  //   const query = {
  //     text: 'DELETE FROM threads WHERE id = $1 RETURNING id',
  //     values: [threadId],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows.length) throw new NotFoundError('Thread');

  //   const { id } = result.rows[0];

  //   return id;
  // }
}

module.exports = ThreadRepositoryPostgres;
