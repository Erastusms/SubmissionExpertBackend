const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container, authenticationTokenManager }) => {
    const threadsHandler = new ThreadsHandler(container, authenticationTokenManager);
    server.route(routes(threadsHandler));
  },
};
