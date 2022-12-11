import Tables from '../tables'
import Query from './query'
import UpdateQuery from './update-query'

export default class SoftDeleteRow extends UpdateQuery {
  identifier: number
  table: Tables

  constructor (table: Tables, id: number) {
    super()
    this.table = table
    this.identifier = id
  }

  async execute () {
    const query = this.client(this.table)

    query.where('id', this.identifier)

    query.update({
      deletedAt: new Date()
    })

    const result = await super.execute(query)
    return result
  }

  protected validate () {
    super.validate()

    this.validateFieldsExist(['table', 'identifier'])
  }
}
