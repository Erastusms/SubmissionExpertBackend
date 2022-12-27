const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'secret',
      fullname: 'new user of this app',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'KKN di desa penari',
      body: 'Pada suatu hari, kami menjalani KKN',
      owner: 'user-123',
      date: '2022',
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return comment correctly', async () => {
      const addCommentPayload = new AddComment({
        content: 'content-test',
        username: 'new user',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'content-test',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(
        addCommentPayload
      );

      const comment = await CommentsTableTestHelper.getDetailComment(
        'comment-123'
      );
      expect(comment).toBeDefined();
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('deleteComment function', () => {
    beforeAll(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-321',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        isDelete: false,
        owner: 'user-123',
      });
    });

    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.findCommentById('comment-999999')
      ).rejects.toThrowError('Comment Not Found');
    });

    it('should throw AuthorizationError when owner not authorization', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyComment({
          commentId: 'comment-123',
          owner: 'user-321',
        })
      ).rejects.toThrowError('Anda tidak berhak mengakses Comment ini');
    });

    it('should remove comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepositoryPostgres.deleteComment(
        'comment-321'
      );

      const commentDetail = await CommentsTableTestHelper.getDetailComment(
        'comment-321'
      );

      expect(comment.id).toEqual('comment-321');
      expect(commentDetail.is_deleted).toEqual(true);
    });
  });
});
