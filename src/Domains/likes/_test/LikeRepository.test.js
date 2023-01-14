const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likesRepository = new LikeRepository();

    // Action and Assert
    await expect(likesRepository.isLikeComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.likeComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.unlikeComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.getTotalLikesInComment('')).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
