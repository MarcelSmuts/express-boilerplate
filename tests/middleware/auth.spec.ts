import { localStrategy } from '../../src/loaders/passport/local'
import Member from '../../src/models/member'

describe('auth middleware', () => {
  describe('passport login strategy', () => {
    describe('when user does not exist', () => {
      it('should call done with error', async () => {
        const memberSpy = jest.spyOn(Member, 'findByEmail')
        memberSpy.mockReturnValue(Promise.resolve(null))

        const done = jest.fn()
        await localStrategy('email', 'pass', done)
        expect(done).toBeCalledTimes(1)
        expect(done).toBeCalledWith('Invalid credentials', null)
      })
    })

    describe('when password invalid', () => {
      it('should call done with error', async () => {
        const done = jest.fn()

        const memberSpy = jest.spyOn(Member, 'findByEmail')

        const member = new Member({
          id: 1,
          firstName: 'firstname',
          email: 'email@email.com',
          passwordHash: 'hash',
          passwordSalt: 'salt'
        })
        memberSpy.mockReturnValue(Promise.resolve(member))

        const validateSpy = jest.spyOn(member, 'validatePassword')
        validateSpy.mockReturnValue(false)

        await localStrategy('email', 'pass', done)
        expect(done).toBeCalledTimes(1)
        expect(done).toBeCalledWith('Invalid credentials', null)
      })
    })

    describe('when user found', () => {
      it('should scrub password fields', async () => {
        const done = jest.fn()

        const memberSpy = jest.spyOn(Member, 'findByEmail')

        const member = new Member({
          id: 1,
          firstName: 'firstname',
          email: 'email@email.com',
          passwordHash: 'hash',
          passwordSalt: 'salt'
        })
        memberSpy.mockReturnValue(Promise.resolve(member))

        const validateSpy = jest.spyOn(member, 'validatePassword')
        validateSpy.mockReturnValue(true)

        await localStrategy('email', 'pass', done)
        expect(done).toBeCalledTimes(1)
        expect(done).toBeCalledWith(null, member)
        expect(member).not.toHaveProperty('passwordHash')
        expect(member).not.toHaveProperty('passwordSalt')
      })
    })
  })
})
