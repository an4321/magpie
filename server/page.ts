import { Hono } from 'hono'
import { db } from './db'
import { pageTable } from './db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { validateJson } from './utils'

const app = new Hono()

const pageSchema = z.object({
	title: z.string().min(1, 'title cannot be empty'),
	index: z.int(),
})
type PageType = z.infer<typeof pageSchema>

app.get('/', async (c) => {
	const userId = c.get('userId')
	const list = await db
		.select()
		.from(pageTable)
		.orderBy(pageTable.index)
		.where(eq(pageTable.userId, userId))

	if (list.length === 0) {
		const result = await db
			.insert(pageTable)
			.values({ title: 'Main', index: 1, userId: userId })
			.returning()
		return c.json(result)
	}

	return c.json(list)
})

app.post('/', validateJson(pageSchema), async (c) => {
	const { title, index } = c.req.valid('json') as PageType
	const userId = c.get('userId')

	const result = await db
		.insert(pageTable)
		.values({ title, userId: userId, index })
		.returning()

	return c.json(result, 201)
})

app.put('/:id', validateJson(pageSchema), async (c) => {
	const id = Number(c.req.param('id'))
	if (isNaN(id)) {
		return c.json({ error: 'invalid id' }, 400)
	}

	const data = c.req.valid('json') as PageType
	const userId = c.get('userId')

	const existing = await db
		.select()
		.from(pageTable)
		.where(and(eq(pageTable.id, id), eq(pageTable.userId, userId)))

	if (existing.length === 0) {
		return c.json({ error: 'page not found' }, 404)
	}

	const result = await db
		.update(pageTable)
		.set({
			...(data.title && { title: data.title }),
			...(data.index && { done: data.index }),
		})
		.where(eq(pageTable.id, id))
		.returning()

	return c.json(result[0])
})

app.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	if (isNaN(id)) {
		return c.json({ error: 'invalid id' }, 400)
	}

	const userId = c.get('userId')
	const existing = await db
		.select()
		.from(pageTable)
		.where(and(eq(pageTable.id, id), eq(pageTable.userId, userId)))

	if (existing.length === 0) {
		return c.json({ error: 'page not found' }, 404)
	}

	await db.delete(pageTable).where(eq(pageTable.id, id))
	return c.json({ message: 'deleted successfully' })
})

export default app
