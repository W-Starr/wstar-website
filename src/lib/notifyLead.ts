import { Resend } from 'resend'
import type { LeadSubmission } from './leads'

const FORM_TYPE_LABELS: Record<LeadSubmission['formType'], string> = {
  contact: 'Contact Form',
  investor: 'Investor Inquiry',
  'ace-acad-waitlist': 'Ace-Acad Waitlist',
  'ai-solutions-intake': 'AI Solutions Sandbox Request',
}

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Resend's shared sandbox sender works without any domain setup — swap in a
// verified wstartech.ng address via RESEND_FROM_EMAIL once the domain is verified.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'WSTAR Leads <onboarding@resend.dev>'
const NOTIFICATION_EMAIL = process.env.LEADS_NOTIFICATION_EMAIL || 'ibrahim@wstartech.ng'

/**
 * Best-effort email notification for a new lead. Never throws — a failure here
 * should never lose the submission, which is already durably stored in Sanity
 * by the time this is called.
 */
export async function notifyLead(lead: LeadSubmission): Promise<void> {
  if (!resend) {
    console.warn('[Leads Notification] RESEND_API_KEY not configured — skipping email notification. Lead is still stored in Sanity.')
    return
  }

  const label = FORM_TYPE_LABELS[lead.formType]
  const detailRows = Object.entries(lead.details || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748B;font-weight:600;text-transform:capitalize;">${key}</td><td style="padding:4px 0;">${value}</td></tr>`)
    .join('')

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      replyTo: lead.email,
      subject: `New ${label} — ${lead.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px;">
          <h2 style="margin-bottom: 4px;">New ${label}</h2>
          <p style="color:#64748B; margin-top: 0;">Submitted via wstartech.ng</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding:4px 12px 4px 0;color:#64748B;font-weight:600;">Name</td><td style="padding:4px 0;">${lead.name}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748B;font-weight:600;">Email</td><td style="padding:4px 0;">${lead.email}</td></tr>
            ${detailRows}
          </table>
        </div>
      `,
    })
  } catch (error) {
    console.error('[Leads Notification] Failed to send email (lead is still stored in Sanity):', error)
  }
}
