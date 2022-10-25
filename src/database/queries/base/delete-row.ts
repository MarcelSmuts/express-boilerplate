import Tables from '../../tables'
import Query from './query'

export default class DeleteRow extends Query {
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
    query.del()

    const result = await super.execute(query)
    return result
  }

  protected validate () {
    super.validate()

    this.validateFieldsExist(['table', 'identifier'])
  }
}
