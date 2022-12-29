const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment');
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

  describe('findCommentById function', () => {
    beforeEach(async () => {
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

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should throw `Comment Not Found` when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.findCommentById('comment-999999')
      ).rejects.toThrowError('Comment Not Found');
    });
  });

  describe('verifyComment function', () => {
    beforeAll(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-444',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        isDelete: false,
        owner: 'user-123',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'new user super',
        password: 'secret',
        fullname: 'super this app',
      });
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should throw `Anda tidak berhak mengakses Comment ini` when comment not authorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const isCommentAuthorized = commentRepositoryPostgres.verifyComment({
        commentId: 'comment-444',
        owner: 'user-321',
      });
      expect(isCommentAuthorized).rejects.toThrowError(
        'Anda tidak berhak mengakses Comment ini'
      );
    });

    it('should throw true when comment is authorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const isCommentAuthorized = commentRepositoryPostgres.verifyComment({
        commentId: 'comment-444',
        owner: 'user-123',
      });
      expect(isCommentAuthorized).resolves.toEqual(true);
    });
  });

  describe('getDetailComment function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-777',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        isDelete: false,
        owner: 'user-123',
      });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should return detail comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const detailComment = await commentRepositoryPostgres.getDetailComment(
        'comment-777'
      );

      expect(detailComment).toStrictEqual(
        new GetDetailComment({
          id: 'comment-777',
          date: '2022',
          username: 'new user',
          content: 'new content',
        })
      );
    });
  });

  describe('getAllCommentInThread function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-777',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        isDelete: false,
        owner: 'user-123',
      });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should return all comment in thread correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const detailComment = await commentRepositoryPostgres.getAllCommentInThread(
        'thread-123'
      );

      expect(detailComment).toBeDefined();
      expect(detailComment).toHaveLength(1);
    });
  });

  describe('deleteComment function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        isDelete: false,
        owner: 'user-123',
      });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    it('should remove comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepositoryPostgres.deleteComment(
        'comment-555'
      );

      const commentDetail = await CommentsTableTestHelper.getDetailComment(
        'comment-555'
      );

      expect(comment.id).toEqual('comment-555');
      expect(commentDetail.is_deleted).toEqual(true);
    });
  });
});
