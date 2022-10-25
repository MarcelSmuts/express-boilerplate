import LocalAuthentication from './auth/local'

export default function initAuthenticationRoutes (app) {
  new LocalAuthentication(app).initRoutes()
}
