import { Request, Response, Application, NextFunction } from 'express'
import { RouteMethod, V1Routes } from '../../v1-api-routes'
import passport from 'passport'
import jwt from 'jsonwebtoken'

export default class LocalAuthentication extends V1Routes {
  constructor (app: Application) {
    super(app)
    this.routes.push(this.signIn)
  }

  private signIn = {
    method: RouteMethod.POST,
    route: 'auth/local',
    handler: async (req: Request, res: Response, next: NextFunction) => {
      return passport.authenticate(
        'login',
        { session: false },
        (err, user, info) => {
          if (err || !user) {
            return res.Unauthorized()
          }
          req.login(user, { session: false }, err => {
            if (err) {
              return res.Unauthorized()
            }

            const token = jwt.sign(user.toJWT(), process.env.JWT_SECRET!, {
              audience: process.env.SITE_URL,
              expiresIn: `${process.env.JWT_EXPIRY_IN_MINUTES}m`
            })

            return res.json(token)
          })
        }
      )(req, res, next)
    },
    skipAuth: true
  }
}
