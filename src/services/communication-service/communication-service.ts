import nodemailer from 'nodemailer'
import forgotPasswordEmail from './emails/forgot-password'
import invitationEmail from './emails/invitation'

const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: process.env.MAIL_FROM_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  }
})

function _sendMail (mailOptions) {
  mailOptions.from = process.env.MAIL_FROM_ADDRESS || ''
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.error(error)
    } else {
      console.info('Successfully sent email.')
    }
  })
}

function sendForgotPasswordEmail (
  to: string,
  otp: string,
  userFirstName: string
) {
  const email = forgotPasswordEmail(to, {
    firstName: userFirstName,
    resetPasswordLink: `${process.env.SITE_URL}/login/confirm-password?otp=${otp}`
  })
  _sendMail(email)
}

function sendInvitationEmail (
  to: string,
  otp: string,
  userFirstName: string,
  companyName: string
) {
  const email = invitationEmail(to, {
    firstName: userFirstName,
    companyName,
    setupPasswordLink: `${process.env.SITE_URL}/login/confirm-password?otp=${otp}`
  })
  _sendMail(email)
}

export default {
  sendInvitationEmail,
  sendForgotPasswordEmail
}
