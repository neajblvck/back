module.exports = {
    db: {
      host: process.env.DB_HOST || 'dzxwr0o.mongodb.net/?retryWrites=true&w=majority',
      port: process.env.DB_PORT || 27017,
      name: process.env.DB_NAME || 'database',
      user: process.env.DB_USER || 'neajblvck',
      password: process.env.DB_PASSWORD || 'neajblvck',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'mysecretkey',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
  };
  