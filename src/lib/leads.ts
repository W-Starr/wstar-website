import { z } from 'zod'

export const leadFormTypeSchema = z.enum([
  'contact',
  'investor',
  'ace-acad-waitlist',
  'ai-solutions-intake',
])

export const leadSubmissionSchema = z.object({
  formType: leadFormTypeSchema,
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('A valid email is required').max(320),
  // Free-form, form-specific fields (company, message, department, bottleneck description, etc.)
  details: z.record(z.string(), z.string().max(5000)).optional().default({}),
  // Honeypot: real users never fill this in — bots that auto-fill every field will
  website: z.string().max(0, 'Spam check failed').optional().or(z.literal('')),
})

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>
