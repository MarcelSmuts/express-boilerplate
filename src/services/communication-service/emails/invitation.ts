import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

export default function invitationEmail (
  to: string,
  templateFields: {
    firstName: string
    companyName: string
    setupPasswordLink: string
  }
) {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, '../templates/invitation.hbs'),
    'utf8'
  )
  const template = handlebars.compile(emailTemplateSource)
  const htmlToSend = template(templateFields)

  const mailOptions = {
    from: '',
    to: to,
    subject: 'Invitation',
    html: htmlToSend
  }

  return mailOptions
}
