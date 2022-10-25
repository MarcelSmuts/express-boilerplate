import axios, { AxiosError } from 'axios'
import { Request, Response, Application, NextFunction, response } from 'express'
import hasPermission from '../../middleware/has-permission'
import { auth, noAuth } from '../../middleware/user-auth'

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
      return this.app[route.method.toLowerCase()](
        this.V1APIRoute(route.route),
        route.skipAuth ? noAuth : auth,
        hasPermission(route.permissions),
        route.handler
      )
    })
  }
}

export { RouteMethod, IV1Route, V1Routes }
