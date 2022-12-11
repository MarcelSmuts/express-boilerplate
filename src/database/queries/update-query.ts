import { Knex } from 'knex'
import Query from './query'

export default abstract class UpdateQuery extends Query {
  constructor () {
    super()

    if (this.constructor === UpdateQuery) {
      throw new Error('Cannot construct abstract class')
    }
  }

  async execute (query: Knex.QueryBuilder) {
    query.update({
      updatedAt: new Date().toISOString()
    })

    return super.execute(query)
  }
}
