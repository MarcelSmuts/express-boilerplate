import e, { Request, Response, NextFunction } from 'express'
import passport from 'passport'

function noAuth (_req: Request, _res: Response, next: NextFunction) {
  return next()
}

function auth (req: Request, res: Response, next: NextFunction) {
  const authenticate = passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        return res.Unauthorized()
      }

      return next()
    }
  )

  authenticate(req, res, next)
}

export { auth, noAuth }
