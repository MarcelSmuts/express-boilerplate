import passport from 'passport'
import localStrategy from './local'
import jwtStrategy from './jwt'
import permissionService from '../../services/permission-service'

export default {
  init (app) {
    passport.use('login', localStrategy)
    passport.use('jwt', jwtStrategy)

    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser(async (id: string, done: Function) => {
      // Find the user
      // const user = await Member.findById(parseInt(id))
      const user = {
        id: 1
      }
      const userPermissions = await permissionService.getPermissionsForUser(
        user!.id
      )

      if (!user) {
        done('User does not exist', null)
      }

      done(null, {
        ...user,
        permissions: userPermissions
      })
    })

    app.use(passport.initialize())
  }
}
