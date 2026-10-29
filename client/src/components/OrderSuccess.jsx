import { useEffect, useState } from 'react'

const MAX_CHECKS = 6 // check up to 6 times...
const WAIT_MS = 2000 // ...2 seconds apart (about 10 seconds in total)

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

// Shown at /order/success?order=7 after Stripe sends the customer back.
// Stripe redirects right away, but the webhook that marks the order 'paid' can arrive
// a moment later — so if the order is still 'pending' we check again a few times.
export default function OrderSuccess() {
  const orderId = new URLSearchParams(window.location.search).get('order')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(orderId ? '' : 'No order number in the link.')
  const [checksDone, setChecksDone] = useState(0)

  useEffect(() => {
    if (!orderId) return
    let cancelled = false
    let timer

    async function check(attempt) {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json().catch(() => ({}))
        if (cancelled) return

        if (!response.ok) {
          setError(response.status === 401 ? 'Please sign in to see this order.' : data.error || 'Could not load the order.')
          return
        }

        setOrder(data)
        setChecksDone(attempt)
        if (data.status === 'pending' && attempt < MAX_CHECKS) {
          timer = setTimeout(() => check(attempt + 1), WAIT_MS)
        }
      } catch {
        if (!cancelled) setError('Could not reach the server.')
      }
    }

    check(1)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderId])

  const stillChecking = order?.status === 'pending' && checksDone < MAX_CHECKS

  let heading = 'Checking your payment…'
  let message = 'Hang on a moment while we confirm your payment with Stripe.'
  if (error) {
    heading = 'Something went wrong'
    message = error
  } else if (order?.status === 'paid') {
    heading = 'Payment received — thank you!'
    message = 'Your order is confirmed and the kitchen has it.'
  } else if (order?.status === 'expired') {
    heading = 'This checkout expired'
    message = 'No payment was taken. You can order again from the menu.'
  } else if (order && !stillChecking) {
    heading = 'Still waiting for confirmation'
    message = "Stripe hasn't confirmed this payment yet. Refresh this page in a minute to check again."
  }

  return (
    <section className="mx-auto max-w-[700px] px-6 py-16">
      <p className="mb-4 text-[0.8rem] tracking-[0.15em] text-clay uppercase">
        Order {orderId ? `#${orderId}` : ''}
      </p>
      <h1 className="mb-3 text-3xl font-bold sm:text-4xl" aria-live="polite">{heading}</h1>
      <p className="mb-8 text-[1.05rem] leading-relaxed text-ink-soft">{message}</p>

      {order && (
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Order summary</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                order.status === 'paid' ? 'bg-ink text-white' : 'border border-line bg-surface-2 text-ink-soft'
              }`}
            >
              {order.status}
            </span>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li key={item.menu_item_id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="font-semibold">{formatMoney(item.unit_price_cents * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total_cents)}</span>
          </p>
        </div>
      )}

      <a
        href="/#menu"
        className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#333333]"
      >
        Back to the menu
      </a>
    </section>
  )
}
