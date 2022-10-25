import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

export default function forgotPasswordEmail (
  to: string,
  templateFields: {
    firstName: string
    resetPasswordLink: string
  }
) {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, '../templates/forgot-password.hbs'),
    'utf8'
  )
  const template = handlebars.compile(emailTemplateSource)
  const htmlToSend = template(templateFields)

  const mailOptions = {
    from: '',
    to: to,
    subject: 'Reset your password',
    html: htmlToSend
  }

  return mailOptions
}
