import sendMail from '../send-mail'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

export default abstract class Email<T> {
  protected to: string
  protected subject: string
  protected _template?: any
  protected emailFields?: T
  protected attachments?: {
    filename: string
    content: Buffer
  }[]

  constructor (
    to: string,
    subject: string,
    template?: string,
    emailFields?: T,
    attachments?: {
      filename: string
      content: Buffer
    }[]
  ) {
    if (this.constructor === Email) {
      throw new Error('Cannot construct abstract class')
    }

    this.to = to
    this.subject = subject
    this.emailFields = emailFields
    this.attachments = attachments

    if (template) {
      const emailTemplateSource = fs.readFileSync(
        path.join(__dirname, `../templates/${template}.hbs`),
        'utf8'
      )
      this._template = handlebars.compile(emailTemplateSource)
    }
  }

  send () {
    let html
    if (this._template) {
      html = this._template(this.emailFields)
    }

    const mailOptions = {
      to: this.to,
      subject: this.subject,
      html: html || '',
      attachments: this.attachments
    }

    sendMail(mailOptions)
  }
}
