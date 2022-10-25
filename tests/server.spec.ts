import { describe, expect, it, jest } from '@jest/globals'
import expressLoader from '../src/loaders/express-loader'
import passportLoader from '../src/loaders/passport/passport-loader'
import routeLoader from '../src/loaders/route-loader'
import loggers from '../src/middleware/loggers'
import { initDatabaseConnection } from '../src/database/connection-manager'
import app from '../src/server'

jest.mock('../src/loaders/passport/passport-loader')
jest.mock('../src/loaders/route-loader')
jest.mock('../src/database/connection-manager')
jest.mock('../src/middleware/loggers')

describe('Server', () => {
  describe('when starts up', () => {
    it('should start all expected loaders and initialize health check', () => {
      jest.doMock('express', () => {
        return require('jest-express')
      })

      const server = app.init()

      expect(expressLoader.init).toHaveBeenCalledTimes(1)
      expect(passportLoader.init).toHaveBeenCalledTimes(1)
      expect(routeLoader.init).toHaveBeenCalledTimes(1)
      expect(initDatabaseConnection).toHaveBeenCalledTimes(1)
      expect(loggers.initErrorHandlers).toHaveBeenCalledTimes(1)
      expect(loggers.initRequestLogger).toHaveBeenCalledTimes(1)
      expect(expressLoader.listen).toHaveBeenCalledTimes(1)

      expect(server.get).toHaveBeenCalledWith(
        '/healthcheck',
        expect.any(Function)
      )
    })
  })
})
