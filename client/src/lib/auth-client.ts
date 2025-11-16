import { createAuthClient } from 'better-auth/react'

const baseURL = import.meta.env.AUTH_BASE_URL || 'http://localhost:3000'
export const authClient = createAuthClient({ baseURL })
