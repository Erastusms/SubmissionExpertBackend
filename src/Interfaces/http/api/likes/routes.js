const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: { auth: 'forumapi_jwt' },
    handler: handler.likeUnlikeHandler,
  },
];

module.exports = routes;
