import { Hono } from 'hono'
import { db } from './db'
import { noteTable, pageTable } from './db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { validateJson } from './utils'

const app = new Hono()

const noteSchema = z.object({
	title: z.string().min(1, 'title cannot be empty'),
	index: z.number(),
	content: z.string(),
	pageId: z.number(),
})
type NoteType = z.infer<typeof noteSchema>

async function ensurePageOwnership(pageId: number, userId: string) {
	const page = await db
		.select()
		.from(pageTable)
		.where(and(eq(pageTable.id, pageId), eq(pageTable.userId, userId)))
	return page.length > 0
}

app.get('/', async (c) => {
	const userId = c.get('userId')

	const pageId = Number(c.req.query('pageId'))
	if (!pageId) {
		return c.json({ error: 'Missing or invalid pageId' }, 400)
	}

	const notes = await db
		.select({
			id: noteTable.id,
			title: noteTable.title,
			content: noteTable.content,
			index: noteTable.index,
			pageId: noteTable.pageId,
		})
		.from(noteTable)
		.innerJoin(pageTable, eq(noteTable.pageId, pageTable.id))
		.where(and(eq(pageTable.userId, userId), eq(noteTable.pageId, pageId)))
		.orderBy(noteTable.index)

	return c.json(notes)
})

app.post('/', validateJson(noteSchema), async (c) => {
	const data = c.req.valid('json') as NoteType
	const userId = c.get('userId')

	const ownsPage = await ensurePageOwnership(data.pageId, userId)
	if (!ownsPage) {
		return c.json({ error: 'page not found or unauthorized' }, 404)
	}

	const result = await db.insert(noteTable).values(data).returning()
	return c.json(result, 201)
})

app.put('/:id', validateJson(noteSchema), async (c) => {
	const id = Number(c.req.param('id'))
	if (isNaN(id)) return c.json({ error: 'invalid id' }, 400)

	const userId = c.get('userId')
	const data = c.req.valid('json') as NoteType

	// check if note exists && belongs to user
	const existing = await db
		.select()
		.from(noteTable)
		.innerJoin(pageTable, eq(noteTable.pageId, pageTable.id))
		.where(and(eq(noteTable.id, id), eq(pageTable.userId, userId)))

	if (existing.length === 0) {
		return c.json({ error: 'note not found' }, 404)
	}

	const result = await db
		.update(noteTable)
		.set({
			title: data.title,
			index: data.index,
			content: data.content,
			pageId: data.pageId,
		})
		.where(eq(noteTable.id, id))
		.returning()

	return c.json(result[0])
})

app.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	if (isNaN(id)) return c.json({ error: 'invalid id' }, 400)

	const userId = c.get('userId')

	// ensure note belongs to user
	const existing = await db
		.select()
		.from(noteTable)
		.innerJoin(pageTable, eq(noteTable.pageId, pageTable.id))
		.where(and(eq(noteTable.id, id), eq(pageTable.userId, userId)))

	if (existing.length === 0) {
		return c.json({ error: 'note not found' }, 404)
	}

	await db.delete(noteTable).where(eq(noteTable.id, id))

	return c.json({ message: 'deleted successfully' })
})

export default app
