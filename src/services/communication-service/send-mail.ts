import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'Smtp-legacy.office365.com',
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_FROM_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

export default function sendMail (mailOptions) {
  mailOptions.from = process.env.MAIL_FROM_ADDRESS || ''
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.error(error)
    } else {
      console.info('Successfully sent email.')
    }
  })
}
