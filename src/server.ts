import dotenv from 'dotenv'
import express from './loaders/express-loader'
import routes from './loaders/route-loader'
import loggers from './middleware/loggers'
import passport from './loaders/passport/passport-loader'
import {
  initDatabaseConnection,
  assertDatabaseConnection
} from './database/connection-manager'
dotenv.config()

// App
const init = () => {
  const app = express.init()
  passport.init(app)
  initDatabaseConnection()
  loggers.initRequestLogger(app)
  routes.init(app)

  app.get('/healthcheck', async (req, res) => {
    await assertDatabaseConnection()
    return res.OK()
  })

  loggers.initErrorHandlers(app)
  express.listen(app)

  return app
}

init()

export default { init }
