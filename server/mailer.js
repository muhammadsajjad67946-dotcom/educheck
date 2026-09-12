import nodemailer from 'nodemailer'

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null

export function isMailConfigured() {
  return Boolean(transporter)
}

export async function sendContactEmails(contact) {
  if (!transporter) return { sent: false, reason: 'SMTP is not configured.' }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  const adminRecipient = process.env.ADMIN_EMAIL || process.env.SMTP_USER
  const subject = contact.subject || 'New EduCheck contact message'
  const text = `Name: ${contact.name}\nEmail: ${contact.email}\nSubject: ${subject}\n\n${contact.message}`

  await Promise.all([
    transporter.sendMail({
      from,
      to: contact.email,
      replyTo: adminRecipient,
      subject: `We received your message: ${subject}`,
      text: `Hello ${contact.name},\n\nThank you for contacting EduCheck. Our team received your message and will reply soon.\n\n${text}`,
    }),
    transporter.sendMail({
      from,
      to: adminRecipient,
      replyTo: contact.email,
      subject: `New contact message: ${subject}`,
      text,
    }),
  ])

  return { sent: true }
}
