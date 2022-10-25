import { Express } from 'express'

declare global {
  namespace Express {
    interface MemberSettings {
      map: {
        useCurrentLocation: boolean
        useOperationArea: boolean
      }
      reportPreferences: {
        property: Array<string>
        area: Array<string>
        street: Array<string>
      }
    }

    interface User {
      id: string | number
      company: {
        id: number
        name: string
      }
      permissions: Array<number>
      firstName?: string | undefined
      lastName?: string | undefined
      email?: string | undefined
      phone?: string | undefined
      settings?: MemberSettings | undefined
      role?: string | undefined
      branch?: string | undefined
    }

    interface Request {
      user: User | undefined
      id: String
    }

    interface Response {
      OK: Function
      BadRequest: Function
      Forbidden: Function
      Unauthorized: Function
      Error: Function
      NotFound: Function
    }
  }
}
