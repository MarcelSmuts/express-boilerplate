import dotenv from 'dotenv'
import knex, { Knex } from 'knex'
import knexStringcase from 'knex-stringcase'
import knexPostgis, { KnexPostgis } from 'knex-postgis'
import pg from 'pg'
dotenv.config()

let databaseClient: Knex
let geoFunc: KnexPostgis
function handleFailure (err: any) {
  console.error(
    '[Fatal] Failed to establish connection to database! Exiting...',
    err
  )
  process.exit(1)
}

async function assertDatabaseConnection () {
  return await databaseClient.raw('select 1+1 as result')
}

async function initDatabaseConnection () {
  try {
    pg.types.setTypeParser(20, Number)
    const config = {
      client: 'pg',
      connection: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl:
          process.env.NODE_ENV === 'development'
            ? null
            : { rejectUnauthorized: false }
      },
      migrations: {
        tableName: 'db_migrations'
      }
    }
    const options = knexStringcase(config)
    databaseClient = knex(options)
    geoFunc = knexPostgis(databaseClient)

    await databaseClient.migrate.latest()
    await assertDatabaseConnection()

    console.info('DATABASE CONNECTION INITIALISED')

    return databaseClient
  } catch (err) {
    handleFailure(err)
  }
}

export {
  initDatabaseConnection,
  assertDatabaseConnection,
  databaseClient,
  geoFunc
}
