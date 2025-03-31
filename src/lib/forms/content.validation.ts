import * as yup from 'yup';
import { z } from 'zod';

export const contentSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    parentID: z.string(),
    intent: z.string(),
    isActive: z.boolean().default(false),
    activeOn: z.date().nullable(),
    expiresOn: z.date().nullable()
})