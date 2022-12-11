import axios, { AxiosError } from 'axios'
import e, { Request, Response, Application, NextFunction } from 'express'
import hasPermission from '../../middleware/has-permission'
import { auth } from '../../middleware/user-auth'
import skipMiddleware from '../../middleware/skip-middleware'

enum RouteMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface IV1Route {
  method: RouteMethod
  route: string
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | undefined>
  permissions?: Array<any>
  middleware?: Array<e.RequestHandler>
  skipAuth?: boolean
}

class V1Routes {
  private app: Application
  routes: IV1Route[]

  constructor (app: Application) {
    this.app = app
    this.routes = []
  }

  private V1APIRoute (route) {
    return `/v1/${route}`
  }

  private isUnauthorizedError (error: Error | AxiosError) {
    if (!axios.isAxiosError(error)) {
      return null
    }

    return (error as AxiosError).response?.status === 401
  }

  defaultErrorHandler (req: Request, res: Response, err: Error | AxiosError) {
    if (this.isUnauthorizedError(err)) {
      return res.Unauthorized()
    }

    throw err
  }

  initRoutes () {
    this.routes.forEach(route => {
      this.app[route.method.toLowerCase()](
        this.V1APIRoute(route.route),
        route.skipAuth ? skipMiddleware : auth,
        hasPermission(route.permissions),
        route.middleware ? route.middleware : skipMiddleware,
        async (req: Request, res: Response, next) => {
          try {
            return route.handler(req, res, next)
          } catch (error) {
            console.error(error)
            return res.Error('An error occurred')
          }
        }
      )
    })
  }
}

export { RouteMethod, IV1Route, V1Routes }
