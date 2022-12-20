const ClientError = require('../ClientError');
const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authorizationError = new AuthorizationError('user');

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('Anda tidak berhak mengakses user ini');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
