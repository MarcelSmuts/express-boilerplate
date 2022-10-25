import { Knex } from 'knex'
import LimitQuery from '../src/database/queries/limit-query'
import { querybuilder } from './setup/mocks'

class TestLimitQuery extends LimitQuery {
  constructor (skip, take) {
    super(skip, take)
  }
}

describe('limit query', () => {
  describe('when executed', () => {
    it('should apply offset and limit', () => {
      const skip = 10
      const take = 20
      const qry = new TestLimitQuery(skip, take) as any

      qry.execute(querybuilder)

      expect(querybuilder.offset).toHaveBeenCalledTimes(1)
      expect(querybuilder.limit).toHaveBeenCalledTimes(1)
      expect(querybuilder.offset).toHaveBeenCalledWith(skip)
      expect(querybuilder.limit).toHaveBeenCalledWith(take)
    })
  })
})
