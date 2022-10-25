import { RouteMethod, V1Routes } from '../../src/routes/v1/v1-api-routes'
import expressLoader from '../../src/loaders/express-loader'
import axios, { AxiosError } from 'axios'
import { auth, noAuth } from '../../src/middleware/user-auth'
import expressHelpers from '../../src/middleware/express-helpers'
import passport from 'passport'
jest.doMock('express', () => {
  return require('jest-express')
})

const app = expressLoader.init()
const routes = new V1Routes(app)

describe('V1 Routes', () => {
  describe('when creating route name', () => {
    it('prepend v1', () => {
      const routeName = 'testroute'
      const v1RouteName = routes['V1APIRoute'](routeName)
      expect(v1RouteName).toEqual(`/v1/${routeName}`)
    })
  })

  describe('no auth function', () => {
    it('should call next function', () => {
      const nextFunc = jest.fn()
      const req: any = {}
      const res: any = {}
      noAuth(req, res, nextFunc)
      expect(nextFunc).toHaveBeenCalledTimes(1)
    })
  })

  describe('auth function', () => {
    describe('when request is not authenticated', () => {
      it('should authenticate with passport jwt', () => {
        const passportSpy = jest.spyOn(passport, 'authenticate')

        const nextFunc = jest.fn()
        const req: any = {
          isAuthenticated: jest.fn(() => {
            return false
          })
        }
        const res: any = {
          sendStatus: jest.fn().mockReturnThis(),
          end: jest.fn(),
          Unauthorized: jest.fn()
        }
        expressHelpers(req, res, () => {})
        auth(req, res, nextFunc)
        expect(passportSpy).toHaveBeenCalledWith(
          'jwt',
          { session: false },
          expect.any(Function)
        )
        expect(passportSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('when request is authenticated', () => {
      it('should call next function', () => {
        const nextFunc = jest.fn()
        const req: any = {
          isAuthenticated: jest.fn(() => {
            return true
          })
        }
        const res: any = {}
        auth(req, res, nextFunc)
        expect(nextFunc).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('isUnauthorizedError function', () => {
    describe('when error is not axios error', () => {
      it('should return null', () => {
        const isAxiosErrorMock = jest.spyOn(axios, 'isAxiosError')
        isAxiosErrorMock.mockImplementation(() => {
          return false
        })
        const err = {
          response: {
            status: 401
          }
        } as AxiosError
        const isUnauthorized = routes['isUnauthorizedError'](err)
        expect(isUnauthorized).toEqual(null)
      })
    })
    describe('when error is unauthorized', () => {
      it('should return true', () => {
        const isAxiosErrorMock = jest.spyOn(axios, 'isAxiosError')
        isAxiosErrorMock.mockImplementation(() => {
          return true
        })
        const err = {
          response: {
            status: 401
          }
        } as AxiosError
        const isUnauthorized = routes['isUnauthorizedError'](err)
        expect(isUnauthorized).toEqual(true)
      })
    })

    describe('when error is not unauthorized', () => {
      const isAxiosErrorMock = jest.spyOn(axios, 'isAxiosError')
      isAxiosErrorMock.mockImplementation(() => {
        return true
      })
      it('should return false', () => {
        const err = {
          response: {
            status: 200
          }
        } as AxiosError
        const isUnauthorized = routes['isUnauthorizedError'](err)
        expect(isUnauthorized).toEqual(false)
      })
    })
  })

  describe('defaultErrorHandler function', () => {
    describe('when error is unauthorized error', () => {
      it('should return unauthorized response', () => {
        const nextFunc = jest.fn()
        const req: any = {}
        const res: any = {
          sendStatus: jest.fn().mockReturnThis(),
          end: jest.fn()
        }
        const err = {
          response: {
            status: 401
          }
        } as AxiosError
        const isUnauthorizedErrorSpy = jest.spyOn(
          routes as any,
          'isUnauthorizedError'
        )
        expressHelpers(req, res, () => {})
        const result = routes.defaultErrorHandler(req, res, err)
        expect(nextFunc).not.toHaveBeenCalled()
        expect(res.sendStatus).toHaveBeenCalledWith(401)
      })
    })
    describe('when error is not unauthorized', () => {
      it('should rethrow the error', () => {
        const req: any = {}
        const res: any = {}
        const err: Error = {
          message: 'test',
          name: 'test'
        }
        expect(() => routes.defaultErrorHandler(req, res, err)).toThrow('test')
      })
    })
  })

  describe('when initializing routes', () => {
    const routeMethods = [
      RouteMethod.DELETE,
      RouteMethod.GET,
      RouteMethod.PATCH,
      RouteMethod.POST,
      RouteMethod.PUT
    ]
    routeMethods.forEach(method => {
      it(`should initialise ${method} method as expected`, () => {
        const handler = jest.fn()
        routes.routes = [
          {
            handler,
            method: method,
            route: 'test',
            skipAuth: true
          }
        ]
        routes.initRoutes()
        expect(app[method.toLowerCase()]).toHaveBeenCalledTimes(1)
        expect(app[method.toLowerCase()]).toHaveBeenCalledWith(
          '/v1/test',
          expect.any(Function),
          expect.any(Function),
          handler
        )
      })
    })
  })

  describe('when skip auth is false', () => {
    const routeMethods = [
      RouteMethod.DELETE,
      RouteMethod.GET,
      RouteMethod.PATCH,
      RouteMethod.POST,
      RouteMethod.PUT
    ]
    routeMethods.forEach(method => {
      it(`should initialise ${method} route with auth`, () => {
        const handler = jest.fn()
        routes.routes = [
          {
            handler,
            method: method,
            route: 'test',
            skipAuth: false
          }
        ]
        routes.initRoutes()
        expect(app[method.toLowerCase()]).toHaveBeenCalledTimes(1)
        expect(app[method.toLowerCase()]).toHaveBeenCalledWith(
          '/v1/test',
          auth,
          expect.any(Function),
          handler
        )
      })
    })
  })

  describe('when skip auth is true', () => {
    const routeMethods = [
      RouteMethod.DELETE,
      RouteMethod.GET,
      RouteMethod.PATCH,
      RouteMethod.POST,
      RouteMethod.PUT
    ]
    routeMethods.forEach(method => {
      it(`should initialise ${method} route with no auth`, () => {
        const handler = jest.fn()
        routes.routes = [
          {
            handler,
            method: method,
            route: 'test',
            skipAuth: true
          }
        ]
        routes.initRoutes()
        expect(app[method.toLowerCase()]).toHaveBeenCalledTimes(1)
        expect(app[method.toLowerCase()]).toHaveBeenCalledWith(
          '/v1/test',
          noAuth,
          expect.any(Function),
          handler
        )
      })
    })
  })
})
