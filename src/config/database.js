module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'blog',
  define: {
    timestamps: true,
    underscored: true,
  },
};
