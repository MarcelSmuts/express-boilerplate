import { Application } from 'express'
import initAuthenticationRoutes from '../routes/v1/modules/auth'
import ExampleRoutes from '../routes/v1/modules/example'

export default {
  init (app: Application) {
    initAuthenticationRoutes(app)
    new ExampleRoutes(app).initRoutes()
  }
}
