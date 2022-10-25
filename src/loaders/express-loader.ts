import express from 'express'
import cors from 'cors'
import { Application } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import expressHelpers from '../middleware/express-helpers'

function configureGracefulShutdown () {
  // Graceful shutdown of server
  process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2')
  })

  process.on('SIGINT', () => {
    console.info('[server] Shutting down...')
    process.exit()
  })

  process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION: ', err)
  })
}

export default {
  init (): Application {
    const app = express()
    if (process.env.NODE_ENV !== 'development') {
      app.use(helmet())
      app.use(compression())
    }
    app.use(
      cors({
        credentials: true,
        origin: (
          process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000'
        ).split(',')
      })
    )
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    app.use(expressHelpers)

    return app
  },
  listen (app: Application) {
    const port = process.env.PORT || '3000'
    const host = process.env.HOST || '0.0.0.0'

    app.listen(parseInt(port), host)
    configureGracefulShutdown()
    console.info(`Running on http://${host}:${port}`)
  }
}
