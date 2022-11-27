const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Laskar Pelangi',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Laskar Pelangi',
      body: Infinity
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'Those Magnificent Men in their Flying Machines Or, How I Flew from London to Paris in 25 Hours 11 Minutes',
      body: 'This film is really good'
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      'THREAD.title_LIMIT_CHAR'
    );
  });

  it('should throw error when title contains restricted character', () => {
    // Arrange
    const payload = {
      title: 'Galih * Ratna',
      body: 'Not a good movie'
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      'THREAD.title_CONTAIN_RESTRICTED_CHARACTER'
    );
  });

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Laskar pelangi',
      body: 'Takkan terikat waktu'
    };

    // Action
    const { title, body } = new Thread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
