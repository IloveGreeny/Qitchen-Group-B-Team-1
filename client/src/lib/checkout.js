// Ask our server to start a Stripe Checkout for these items, then send the browser to Stripe.
// items: [{ menuItemId, quantity }] — we never send prices; the server looks them up.
// Throws an error with .status (401 = not signed in) if the server says no.
export async function startCheckout(items) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Could not start checkout')
    error.status = response.status
    throw error
  }

  // Leave our site and go to Stripe's hosted payment page
  window.location.assign(data.url)
}
