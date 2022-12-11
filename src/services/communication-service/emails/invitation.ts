import Email from './email'

interface InvitationEmailFields {
  firstName: string
  companyName: string
  setupPasswordLink: string
}

export default class InvitationEmail extends Email<InvitationEmailFields> {
  constructor (
    toAddress: string,
    userFirstName: string,
    companyName: string,
    otp: string
  ) {
    super(toAddress, 'Invitation', 'invitation', {
      firstName: userFirstName,
      companyName: companyName,
      setupPasswordLink: `${process.env.SITE_URL}/login/confirm-password?otp=${otp}`
    })
  }
}
