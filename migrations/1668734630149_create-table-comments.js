/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    content: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
  pgm.addConstraint(
    'comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
