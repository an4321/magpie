import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import { auth, authMiddleware, redirectUnauthenticated } from './auth'
import { cors } from 'hono/cors'
import page from './page'
import note from './note'

const app = new Hono()

app.use(logger())

app.use('/main', redirectUnauthenticated)
app.use('/*', serveStatic({ root: './client/dist' }))

const origin = process.env.TRUSTED_ORIGINS?.split(',') as string[]

app.use(
	'/api/auth/*',
	cors({
		origin,
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
)

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

app.get('/api', (c) => c.json('ok'))

app.use('/api/*', authMiddleware)

app.route('/api/page', page)
app.route('/api/note', note)

export type AppType = typeof app
export default app
