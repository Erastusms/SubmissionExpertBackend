const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    options: { auth: 'forumapi_jwt' },
    handler: handler.addThreadHandler,
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getDetailThreadHandler,
  },
];

module.exports = routes;
