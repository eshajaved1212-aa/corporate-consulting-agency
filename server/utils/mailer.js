/* ─────────────────────────────────────────────────
   Nodemailer helper for ConsultPro
   Uses Gmail App Password or any SMTP provider.
   Set these in server/.env:
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your@email.com
     SMTP_PASS=your-app-password
     ADMIN_EMAIL=admin@consultpro.com
   ───────────────────────────────────────────────── */

const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // If SMTP env vars are not set, return null (skip emails)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP not configured. Email notifications disabled.');
    console.warn('   Set SMTP_HOST, SMTP_USER, SMTP_PASS in server/.env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: (parseInt(process.env.SMTP_PORT) || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/* ── Send an email ── */
async function sendMail({ to, subject, html }) {
  const tr = getTransporter();
  if (!tr) return; // silently skip if SMTP not configured

  try {
    const info = await tr.sendMail({
      from: `"ConsultPro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    // Don't throw — email failures shouldn't break API responses
  }
}

/* ── Contact form confirmation to admin ── */
async function notifyAdminNewContact(form) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  await sendMail({
    to: adminEmail,
    subject: `New Contact Inquiry: ${form.name} from ${form.company || 'Unknown'}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${form.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${form.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Company</td><td style="padding:8px;border:1px solid #ddd;">${form.company || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Service</td><td style="padding:8px;border:1px solid #ddd;">${form.service || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${form.message}</td></tr>
      </table>
    `,
  });
}

/* ── Auto-reply to person who contacted ── */
async function sendContactAutoReply(form) {
  await sendMail({
    to: form.email,
    subject: 'Thank you for contacting ConsultPro',
    html: `
      <div style="font-family:sans-serif;max-width:500px;">
        <h2 style="color:#1a237e;">Thank you, ${form.name}!</h2>
        <p>We've received your inquiry and a senior consultant will be in touch within <strong>one business day</strong>.</p>
        <hr style="border:none;border-top:1px solid #eee;" />
        <p style="color:#666;font-size:13px;">
          <strong>ConsultPro</strong><br/>
          200 Park Avenue, Suite 1500<br/>
          New York, NY 10166, USA
        </p>
      </div>
    `,
  });
}

/* ── Admin reply to a service inquiry (sent from admin's Gmail) ── */
async function sendInquiryReply({ to, name, serviceTitle, replyMessage }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  await sendMail({
    to,
    subject: `Re: Your inquiry about ${serviceTitle} — ConsultPro`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;">
        <h2 style="color:#1a237e;">Re: ${serviceTitle}</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to <strong>ConsultPro</strong>. Our team has reviewed your inquiry and here is our response:</p>
        <div style="background:#f5f7ff;border-left:4px solid #3B82F6;padding:14px 18px;border-radius:6px;margin:16px 0;color:#222;">
          ${replyMessage}
        </div>
        <p>If you have any further questions, feel free to reply to this email. We're happy to help.</p>
        <hr style="border:none;border-top:1px solid #eee;" />
        <p style="color:#666;font-size:13px;">
          <strong>ConsultPro</strong><br/>
          200 Park Avenue, Suite 1500<br/>
          New York, NY 10166, USA
        </p>
      </div>
    `,
  });
}

/* ── Admin reply to a contact submission (sent from admin's Gmail) ── */
async function sendContactReply({ to, name, replyMessage }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  await sendMail({
    to,
    subject: `Re: Your inquiry to ConsultPro`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;">
        <h2 style="color:#1a237e;">Re: Your inquiry to ConsultPro</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to <strong>ConsultPro</strong>. Our team has reviewed your message and here is our response:</p>
        <div style="background:#f5f7ff;border-left:4px solid #3B82F6;padding:14px 18px;border-radius:6px;margin:16px 0;color:#222;">
          ${replyMessage}
        </div>
        <p>If you have any further questions, feel free to reply to this email. We're happy to help.</p>
        <hr style="border:none;border-top:1px solid #eee;" />
        <p style="color:#666;font-size:13px;">
          <strong>ConsultPro</strong><br/>
          200 Park Avenue, Suite 1500<br/>
          New York, NY 10166, USA
        </p>
      </div>
    `,
  });
}

/* ── Service inquiry notification ── */
async function notifyAdminServiceInquiry(inquiry) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  await sendMail({
    to: adminEmail,
    subject: `New Service Inquiry: ${inquiry.serviceTitle} from ${inquiry.name}`,
    html: `
      <h2>New Service Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Service</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.serviceTitle}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.phone || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.message}</td></tr>
      </table>
    `,
  });
}

module.exports = {
  sendMail,
  notifyAdminNewContact,
  sendContactAutoReply,
  notifyAdminServiceInquiry,
  sendInquiryReply,
  sendContactReply,
};
