import { Request, Response, Application, NextFunction } from 'express'
import { RouteMethod, V1Routes } from '../../v1-api-routes'
import passport from 'passport'
import UpdatePassword from '../../../../database/queries/members/update-password'
import authService from '../../../../services/example-service'
import jwt from 'jsonwebtoken'
import { userInfo } from 'os'
import Member from '../../../../models/example'

export default class LocalAuthentication extends V1Routes {
  constructor (app: Application) {
    super(app)
    this.routes.push(
      this.signIn,
      this.confirmPassword,
      this.forgotPassword,
      this.me
    )
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

  private confirmPassword = {
    method: RouteMethod.POST,
    route: 'auth/local/confirmpassword',
    handler: async (req: Request, res: Response) => {
      try {
        if (!req.body.password || !req.body.otp) {
          return res.BadRequest()
        }

        const member = await authService.validateOTP(req.body.otp)

        if (!member) {
          return res.Unauthorized()
        }

        const updatePassQry = new UpdatePassword(req.body.password, member.id)
        await updatePassQry.execute()

        return res.OK()
      } catch (err) {
        console.error(err)
        return res.Unauthorized()
      }
    },
    skipAuth: true
  }

  private forgotPassword = {
    method: RouteMethod.POST,
    route: 'auth/local/forgotpassword',
    handler: async (req: Request, res: Response) => {
      if (!req.body.email) {
        return res.BadRequest()
      }

      authService.forgotPassword(req.body.email)
      return res.OK()
    },
    skipAuth: true
  }

  private me = {
    method: RouteMethod.GET,
    route: 'auth/local/me',
    handler: async (req: Request, res: Response) => {
      return res.OK({ user: req.user })
    }
  }
}
