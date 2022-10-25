require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'db_migrations'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'db_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'db_migrations'
    }
  }
}
