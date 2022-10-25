jest.mock('express', () => {
  return require('jest-express')
})

jest.mock('redis', () => {
  return require('redis-mock')
})

jest.mock('../../src/loaders/express-loader', () => ({
  init: jest.fn(() => {
    return {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      use: jest.fn(),
      listen: jest.fn()
    }
  }),
  listen: jest.fn()
}))

const knexMock = jest.mock('knex')

jest.mock('../../src/database/connection-manager', () => {
  return {
    initDatabaseConnection: jest.fn(),
    assertDatabaseConnection: jest.fn(),
    databaseClient: knexMock
  }
})

jest.mock('axios')

import axios from 'axios'

axios.create.mockReturnThis()

export const querybuilder = {
  where: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  toSQL: jest.fn().mockReturnThis(),
  toNative: jest.fn()
}
