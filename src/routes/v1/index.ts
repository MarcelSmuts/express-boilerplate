import { Application } from 'express'
import initAuthenticationRoutes from './modules/auth'

export default {
  init (app: Application) {
    initAuthenticationRoutes(app)
  }
}
