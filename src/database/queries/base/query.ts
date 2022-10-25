import { Knex } from 'knex'
import { databaseClient } from '../connection-manager'
import _ from 'lodash'

export default abstract class Query {
  protected client: Knex

  constructor () {
    if (this.constructor === Query) {
      throw new Error('Cannot construct abstract class')
    }

    this.client = databaseClient
  }

  async execute (query: Knex.QueryBuilder) {
    this.validate()

    // TODO: implement transactions
    const qryResult = await query
    return qryResult
  }

  protected validate () {
    this.validateClient()
    this.validateUserPermissions()
  }

  private validateUserPermissions () {}

  private validateClient () {
    if (!this.client) {
      throw new Error('Database connection not initialised')
    }
  }

  protected validateFieldsExist (fields: Array<string>) {
    fields.forEach(fieldName => {
      const field = _.get(this, fieldName)
      if (!field) {
        this.fieldRequired(fieldName)
      }
    })
  }

  protected fieldRequired (fieldName: string) {
    console.error(`Field not provided: ${fieldName}`)
    throw new Error('Validation failed')
  }
}
