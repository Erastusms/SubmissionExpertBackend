const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

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

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'testing',
        password: 'secret',
        fullname: 'testing full',
      },
    });

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
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted add comment', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'new content' },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { body: 123 },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 123 },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    beforeEach(async () => {
      const server = await createServer(container);
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'new content' },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      commentId = responseAddCommentJson.data.addedComment.id;
    });

    it('should respond with 200 and return success status', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 403 when user try to remove comment that they dont own', async () => {
      const server = await createServer(container);

      const loginPayloadNewUser = {
        username: 'newUser',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'newUser',
          password: 'secret',
          fullname: 'new user full',
        },
      });

      const responseAuthNewUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayloadNewUser,
      });

      const responseAuthNewUserJson = JSON.parse(responseAuthNewUser.payload);
      const accessTokenAnotherUser = responseAuthNewUserJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessTokenAnotherUser}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
