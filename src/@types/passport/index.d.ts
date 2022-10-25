import { Express } from 'express'

declare global {
  namespace Express {
    interface Company {
      id: number
      name: string
    }
    interface User {
      id: number
      company: Company
    }

    interface Request {
      user: User | undefined
    }
  }
}
