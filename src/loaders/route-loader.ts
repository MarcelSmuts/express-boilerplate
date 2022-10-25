import { Application } from 'express'
import initAuthenticationRoutes from '../routes/v1/modules/auth'

export default {
  init (app: Application) {
    initAuthenticationRoutes(app)
    new ExampleRoutes(app).initRoutes()
  }
}
