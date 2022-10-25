import { Strategy as LocalStrategy } from 'passport-local'

export const localStrategy = async (username, password, done) => {
  try {
    // Find the user
    // const user = await Member.findByEmail(username, true)
    const user = {
      // This should be replaced with a valid function
      validatePassword: password => {
        return true
      }
    }

    if (!user) {
      return done('Invalid credentials', null)
    }

    // Validate their password
    const passwordIsValid = user.validatePassword(password)

    if (!passwordIsValid) {
      return done('Invalid credentials', null)
    }

    // Remove any sensitive information
    // delete user.passwordHash
    // delete user.passwordSalt

    return done(null, user)
  } catch (err) {
    console.error(err)
    return done('Invalid credentials', null)
  }
}

export default new LocalStrategy(localStrategy)
