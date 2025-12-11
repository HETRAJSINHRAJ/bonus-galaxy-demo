"use server"

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return { success: false, error: "Bitte füllen Sie alle Pflichtfelder aus." }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }
  }

  try {
    // Send email using mailto link simulation for now
    // In production, you would use a service like Resend, SendGrid, or Nodemailer

    // Log the contact request (in production, this would send an actual email)
    console.log("Contact form submission:", {
      to: "office@bonus-galaxy.com",
      from: email,
      name,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // For demo purposes, we'll simulate a successful submission
    // In production, replace this with actual email sending logic:
    //
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@bonus-galaxy.com',
    //   to: 'office@bonus-galaxy.com',
    //   subject: `[Kontaktformular] ${subject}`,
    //   html: `
    //     <h2>Neue Kontaktanfrage</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>E-Mail:</strong> ${email}</p>
    //     <p><strong>Betreff:</strong> ${subject}</p>
    //     <p><strong>Nachricht:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    return { success: true }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }
  }
}
