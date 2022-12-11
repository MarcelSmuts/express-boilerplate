import Email from './email'

interface ForgotPasswordEmailFields {
  firstName: string
  resetPasswordLink: string
}

export default class ForgotPasswordEmail extends Email<
  ForgotPasswordEmailFields
> {
  constructor (toAddress: string, userFirstName: string, otp: string) {
    super(toAddress, 'Reset your password', 'forgot-password', {
      firstName: userFirstName,
      resetPasswordLink: `${process.env.SITE_URL}/login/confirm-password?otp=${otp}`
    })
  }
}
