import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Add your Stripe test key (sk_test_...) to server/.env.')
}

// One Stripe client for the whole server, using the secret key.
// With a sk_test_ key everything happens in test mode: no real money moves.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
