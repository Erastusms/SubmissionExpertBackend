const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
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
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      username: 'new user',
      date: '2022',
      content: 'new content',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('isLikeComment function', () => {
    it('should throw true when likes is exist', async () => {
      await LikesTableTestHelper.addLikes({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(
        likeRepositoryPostgres.isLikeComment({
          commentId: 'comment-123',
          owner: 'user-123',
        })
      ).resolves.toEqual(true);
    });

    it('should throw false when likes is not exist', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-321',
        threadId: 'thread-123',
        username: 'new user',
        date: '2022',
        content: 'new content',
        owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(
        likeRepositoryPostgres.isLikeComment({
          commentId: 'comment-321',
          owner: 'user-123',
        })
      ).resolves.toEqual(false);
    });
  });

  describe('likeComment function', () => {
    it('should persist add like correctly', async () => {
      const likePayload = new AddLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await likeRepositoryPostgres.likeComment(likePayload);

      const likesDetail = await LikesTableTestHelper.getDetailLike(likePayload);
      expect(likesDetail).toBeDefined();
      expect(likesDetail.id).toStrictEqual('likes-123');
    });
  });

  describe('unlikeComment function', () => {
    it('should persist unlike correctly', async () => {
      await LikesTableTestHelper.addLikes({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const unlikePayload = new AddLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const unlikeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await unlikeRepositoryPostgres.unlikeComment(unlikePayload);

      const unlikesDetail = await LikesTableTestHelper.getDetailLike(
        unlikePayload
      );
      expect(unlikesDetail).toBeUndefined();
    });
  });

  describe('getTotalLikesInComment function', () => {
    it('should return total likes in comment correctly', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'new user 321',
        password: 'secret',
        fullname: 'new user',
      });
      await LikesTableTestHelper.addLikes({
        id: 'likes-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLikes({
        id: 'likes-321',
        commentId: 'comment-123',
        owner: 'user-321',
      });

      const expectedTotalLikesInComment = 2;
      const totalLikes = await likeRepositoryPostgres.getTotalLikesInComment(
        'comment-123'
      );

      expect(totalLikes).toBeDefined();
      expect(totalLikes.length).toStrictEqual(expectedTotalLikesInComment);
    });
  });
});
