import { z } from 'zod';

export const folderSchema = z.object({
	name: z.string(),
	parentID: z.string().nullable()
});