import { z } from 'zod'
import { validator } from 'hono/validator'

export function validateJson(schema: z.ZodSchema) {
	return validator('json', (value, c) => {
		const parsed = schema.safeParse(value)
		if (!parsed.success) {
			return c.json({ error: z.treeifyError(parsed.error) }, 400)
		}
		return parsed.data
	})
}
