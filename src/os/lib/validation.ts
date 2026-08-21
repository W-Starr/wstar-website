import { z } from 'zod'

export const workItemTypeSchema = z.enum([
  'task',
  'bug',
  'feature',
  'tech_debt',
  'improvement',
  'research',
])

export const workItemStatusSchema = z.enum([
  'backlog',
  'todo',
  'in_progress',
  'blocked',
  'done',
])

export const workItemPrioritySchema = z.enum(['critical', 'high', 'medium', 'low'])

export const productIdSchema = z.enum(['ace-acad', 'plantiq', 'wstar-core'])

export const syncActionSchema = z.enum(['create', 'patch', 'delete'])

export const docTypeSchema = z.enum([
  'workItem',
  'proposal',
  'decision',
  'feedback',
  'activity',
  'roadmap',
  'product',
  'productArea',
  'project',
  'productCommandCenter',
])

export const syncRequestSchema = z.object({
  action: syncActionSchema,
  docType: docTypeSchema,
  id: z.string().min(1, 'Document ID is required'),
  data: z.record(z.string(), z.any()).optional(),
})

export type SyncRequest = z.infer<typeof syncRequestSchema>
