const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'secret',
      fullname: 'new user of this app',
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return thread correctly', async () => {
      const addThreadPayload = new AddThread({
        title: 'title-1',
        body: 'body-2',
        owner: 'user-123',
      });

      const addNewThread = {
        ...addThreadPayload,
        date: '2022',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedThread = await threadRepositoryPostgres.addThread(
        addNewThread
      );

      const thread = await ThreadsTableTestHelper.getDetailThread('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'title-1',
          body: 'body-2',
          owner: 'user-123',
        })
      );
    });
  });

  describe('getDetailThread', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-321',
        title: 'new title',
        body: 'new body',
        owner: 'user-123',
        date: '2022',
      });
    });

    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      
      await expect(
        threadRepositoryPostgres.verifyThreadAvaibility('thread-999999')
      ).rejects.toThrowError('Thread Not Found');
    });

    it('should return detail thread correctly', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const detailThread = await threadRepositoryPostgres.getDetailThread(
        'thread-321'
      );

      expect(detailThread).toStrictEqual(
        new GetDetailThread({
          id: 'thread-321',
          title: 'new title',
          body: 'new body',
          username: 'new user',
          date: '2022',
        })
      );
    });
  });
});
