import { createAuthClient } from 'better-auth/react'

// No baseURL needed: it calls /api/auth/* on the same site the page is on.
// Locally Vite forwards that to Express; live, Vercel forwards it to Railway.
export const authClient = createAuthClient()

export const { useSession, signIn, signUp, signOut } = authClient
