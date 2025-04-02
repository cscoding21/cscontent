import { z } from 'zod'


export const outContentSchema = z.object({
    id: z.string(),
    slug: z.string(),
    body: z.string(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type OutContent = z.infer<typeof outContentSchema>;