import LocalAuthentication from './local'

export default function initAuthenticationRoutes (app) {
  new LocalAuthentication(app).initRoutes()
}
