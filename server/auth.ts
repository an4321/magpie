import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import { Context, Next } from 'hono'

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') as string[]

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	trustedOrigins,
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
})

declare module 'hono' {
	interface ContextVariableMap {
		userId: string
		userImage: string
		userName: string
		userEmail: string
	}
}

export async function authMiddleware(c: Context, next: Next) {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		})
		if (!session) {
			return c.json({ error: 'Unauthorized' }, 401)
		}
		c.set('userId', session.user.id)
		c.set('userImage', session.user.image as string)
		c.set('userName', session.user.name)
		c.set('userEmail', session.user.email)
		await next()
	} catch (err) {
		return c.json({ error: 'Unauthorized' }, 401)
	}
}

export async function redirectUnauthenticated(c: Context, next: Next) {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		})
		if (!session) return c.redirect('/')
		await next()
	} catch (err) {
		return c.json({ error: 'Unauthorized' }, 401)
	}
}
