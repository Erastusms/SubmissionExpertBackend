const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

let owner;
let accessToken;
let threadId;
let commentId;

describe('/threads/{threadId}/comments endpoint', () => {
  beforeEach(async () => {
    const loginPayload = {
      username: 'testing',
      password: 'secret',
    };

    const server = await createServer(container);

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'testing',
        password: 'secret',
        fullname: 'testing full',
      },
    });

    const responseUserJson = JSON.parse(responseUser.payload);
    owner = responseUserJson.data.addedUser.id;

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    });

    const responseAuthJson = JSON.parse(responseAuth.payload);
    accessToken = responseAuthJson.data.accessToken;
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'new title',
        body: 'new body',
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const responseThreadJson = JSON.parse(responseThread.payload);
    threadId = responseThreadJson.data.addedThread.id;

    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: { content: 'new content' },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const responseCommentJson = JSON.parse(responseComment.payload);
    commentId = responseCommentJson.data.addedComment.id;
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should respond with 200 and adding like to comments', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const detailLikes = await LikesTableTestHelper.getDetailLike({
        commentId,
        owner,
      });
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(detailLikes.id).toBeDefined();
      expect(detailLikes.comment_id).toEqual(commentId);
      expect(detailLikes.owner).toEqual(owner);
    });

    it('should respond with 200 and deleting like from comments', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const detailLikes = await LikesTableTestHelper.getDetailLike({
        commentId,
        owner,
      });
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(detailLikes).toBeUndefined();
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);
      const threadIdNew = 'thread-123456';

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdNew}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should respond with 404 if comment does not exist', async () => {
      const server = await createServer(container);
      const commentIdNew = 'comment-123456';

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentIdNew}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
