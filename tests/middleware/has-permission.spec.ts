import hasPermission from '../../src/middleware/has-permission'
import { Request, Response } from 'express'
import expressHelpers from '../../src/middleware/express-helpers'

describe('has-permission middleware', () => {
  describe('when there are no required permissions', () => {
    it('should call next function', () => {
      const req = {} as Request
      const res = {} as Response
      const nextFunction = jest.fn()

      hasPermission([])(req, res, nextFunction)
      expect(nextFunction).toHaveBeenCalledTimes(1)
    })
  })

  describe('when user has permission', () => {
    it('should call next function', () => {
      const req: any = {
        user: {
          permissions: [1, 2, 3]
        }
      }
      const res = {} as Response
      const nextFunction = jest.fn()

      hasPermission([1, 2, 3])(req, res, nextFunction)
      expect(nextFunction).toHaveBeenCalledTimes(1)
    })
  })

  describe('when user does not have required permissions', () => {
    it('should return 403', () => {
      const req: any = {
        user: {
          permissions: [2, 3]
        }
      }
      const res: any = {
        sendStatus: jest.fn().mockReturnThis(),
        end: jest.fn()
      }
      const nextFunction = jest.fn()

      expressHelpers(req, res, () => {})
      const response = hasPermission([2, 3, 4])(req, res, nextFunction)
      expect(nextFunction).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(403)
    })
  })

  describe('when user is admin', () => {
    it('should always return continue', () => {
      const req: any = {
        user: {
          permissions: [1]
        }
      }
      const res: any = {
        sendStatus: jest.fn().mockReturnThis(),
        end: jest.fn()
      }
      const nextFunction = jest.fn()

      const response = hasPermission([2, 3, 4])(req, res, nextFunction)
      expect(nextFunction).toHaveBeenCalledTimes(1)
    })
  })
})
