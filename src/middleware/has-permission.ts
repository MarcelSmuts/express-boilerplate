import { NextFunction, Request, Response } from 'express'

function hasPermission (requiredPermissions?: Array<number>) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return next()
    }

    if (!req.user || !req.user.permissions) {
      return res.Forbidden()
    }

    const hasAllRequiredPermissions = requiredPermissions.every(
      requiredPermission => req.user!.permissions.includes(requiredPermission)
    )

    if (!hasAllRequiredPermissions) {
      return res.Forbidden()
    }

    return next()
  }
}

export default hasPermission
