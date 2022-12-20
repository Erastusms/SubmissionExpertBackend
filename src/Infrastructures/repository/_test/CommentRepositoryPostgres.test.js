const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'jwtTokenManager-123',
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
      const addComment = new AddComment({
        content: 'content-1',
      });
      const addedCommentExpected = {
        ...addComment,
        id: 'comment-123',
        owner: 'user-123',
      };

      const addCommentPayload = {
        ...addedCommentExpected,
        username: 'new user',
        threadId: 'thread-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(
        addCommentPayload
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'content-1',
          owner: 'user-123',
        })
      );
    });
  });

  describe('removeComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.findCommentById('comment-999999')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner not authorization', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyComment({
          commentId: 'comment-123',
          owner: 'user-321',
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should remove comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const isOwnerAuthorization = await commentRepositoryPostgres.verifyComment({
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const commentId = await commentRepositoryPostgres.deleteComment(
        'comment-123'
      );
      const commentDetail = await commentRepositoryPostgres.getDetailCommentByCommentId(
        'comment-123'
      );

      expect(isOwnerAuthorization).toEqual(true);
      expect(commentId).toEqual('comment-123');
      expect(commentDetail.content).toEqual('**komentar telah dihapus**');
    });
  });
});
