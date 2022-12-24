const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const ThreadsRepository = new ThreadRepository();

    await expect(ThreadsRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(ThreadsRepository.getDetailThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(ThreadsRepository.verifyThreadAvaibility('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
