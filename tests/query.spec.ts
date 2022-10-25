import Query from '../src/database/queries/query'

class TestQuery extends Query {
  testField: string
  nestedObj: object

  constructor () {
    super()

    this.testField = 'test'
    this.nestedObj = {
      nestedField: 'test nested'
    }
  }
}

describe('Query', () => {
  describe('when constructed', () => {
    it('should set the database client', () => {
      const qry = new TestQuery() as any

      expect(qry.client).not.toBeUndefined
    })
  })

  describe('when executed', () => {
    it('should validate client and user permissions', () => {
      const qry = new TestQuery() as any
      const validateSpy = jest.spyOn(qry as any, 'validate')
      qry.execute()

      expect(validateSpy).toBeCalledTimes(1)
    })
  })

  describe('when validating fields', () => {
    describe('when fields are not set', () => {
      it('should throw an error', () => {
        const qry = new TestQuery() as any
        expect(qry.validateFieldsExist).toBeInstanceOf(Function)

        expect(() => {
          qry.validateFieldsExist(['fieldDoesntExist'])
        }).toThrowError('Validation failed')
      })
    })

    describe('when fields are set', () => {
      it('should succeed', () => {
        const qry = new TestQuery() as any
        expect(qry.validateFieldsExist).toBeInstanceOf(Function)

        expect(() => {
          qry.validateFieldsExist(['testField', 'nestedObj.nestedField'])
        }).not.toThrow()
      })
    })
  })
})
