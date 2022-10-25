import GetPermissionsForUser from '../database/queries/permissions/get-permissions-for-member'

class PermissionsService {
  private static _instance: PermissionsService

  permissions: Record<string, number[]>

  constructor () {
    this.permissions = {}
  }

  public static get Instance () {
    return this._instance || (this._instance = new this())
  }

  invalidatePermissionsForUser (userId: number) {
    delete this.permissions[userId]
  }

  async getPermissionsForUser (userId: number) {
    if (!this.permissions[userId]) {
      const qry = new GetPermissionsForUser(userId)
      const permissions = await qry.execute()
      this.permissions[userId.toString()] = permissions
    }

    return this.permissions[userId]
  }
}

export default new PermissionsService()
