import { Knex } from 'knex'
import Query from './query'

export default abstract class LimitQuery extends Query {
  skip: number
  take: number

  constructor (skip = 0, take = 0) {
    super()

    if (this.constructor === LimitQuery) {
      throw new Error('Cannot construct abstract class')
    }

    this.skip = skip
    const maxTake = parseInt(process.env.MAX_TAKE || '100')
    this.take = Math.min(take, maxTake)
  }

  async execute (query: Knex.QueryBuilder) {
    if (this.skip && this.skip > 0) {
      query.offset(this.skip)
    }

    if (this.take && this.take > 0) {
      query.limit(this.take)
    }

    return super.execute(query)
  }
}
