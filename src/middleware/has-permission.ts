import { NextFunction, Request, Response } from 'express'
import Permissions from '../models/lookup-user-permissions'
import permissionService from '../services/permission-service'

function hasPermission (requiredPermissions?: Array<number>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return next()
    }

    if (!req.user) {
      return res.Forbidden()
    }

    const userPermissions = await permissionService.getPermissionsForUser(
      req.user.id
    )

    const isAdmin = userPermissions.includes(Permissions.Admin)

    if (isAdmin) {
      return next()
    }

    const hasAllRequiredPermissions = requiredPermissions.every(
      requiredPermission => userPermissions.includes(requiredPermission)
    )

    if (!hasAllRequiredPermissions) {
      return res.Forbidden()
    }

    return next()
  }
}

export default hasPermission
