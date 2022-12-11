import { Request, Response, NextFunction, Application } from 'express'
import { randomUUID } from 'crypto'
import { performance } from 'perf_hooks'

// Prevent logging requests for these routes as they contain passwords.
const noLog = [
]

function requestLogger (req, res: Response, next: NextFunction) {
  const t0 = performance.now()
  console.time(req.id)
  console.info('Request received: ', {
    ID: req.id,
    METHOD: req.method,
    PATH: req.path,
    QUERY: noLog.includes(req.path) ? '*****' : req.query,
    BODY: noLog.includes(req.path) ? '*****' : req.body
  })
  res.once('finish', () => {
    const t1 = performance.now()
    console.info('Request complete: ', {
      ID: req.id,
      METHOD: req.method,
      PATH: req.path,
      EXECUTION_TIME: t1 - t0,
      STATUS_CODE: res.statusCode
    })
  })
  next()
}

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  res.status(500).send({ error: 'Oh no. Something failed!' })
}

function initErrorHandlers (app: Application) {
  app.use(logErrors)
  app.use(clientErrorHandler)
}

function initRequestLogger (app: Application) {
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(requestLogger)
}

export default {
  initRequestLogger,
  initErrorHandlers
}

class HttpException extends Error {
  status: number
  message: string
  constructor (status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}
