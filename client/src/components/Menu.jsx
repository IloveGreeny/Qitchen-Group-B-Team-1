import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import AuthDialog from './AuthDialog.jsx'
import { startCheckout } from '../lib/checkout.js'

export default function Menu() {
  const [menu, setMenu] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [activeType, setActiveType] = useState('All')
  // { [itemId]: true } for every dish the user has hearted
  const [favorites, setFavorites] = useState({})
  const [orderingId, setOrderingId] = useState(null) // which dish is being sent to Stripe
  const [orderError, setOrderError] = useState('')
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // Load the dishes from our API (which reads them from Postgres) once, on first render
  useEffect(() => {
    let ignore = false // skip setState if the component unmounted before the response came back

    fetch('/api/menu')
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        return response.json()
      })
      .then((items) => {
        if (ignore) return
        setMenu(items)
        setStatus('ready')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  // Pressing Back on Stripe's page can restore this page from the browser's cache
  // with a button still saying "Redirecting…", so reset it when that happens
  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) setOrderingId(null)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  function setFavorite(id, isOn) {
    setFavorites((prev) => ({ ...prev, [id]: isOn }))
  }

  async function handleOrder(id) {
    setOrderError('')
    setOrderingId(id)
    try {
      await startCheckout([{ menuItemId: id, quantity: 1 }])
      // On success the browser is already on its way to Stripe
    } catch (error) {
      setOrderingId(null)
      if (error.status === 401) {
        setOrderError('Please sign in to place an order.')
        setIsAuthOpen(true)
      } else {
        setOrderError(error.message)
      }
    }
  }

  // 'All' plus every type that appears in the data, in order
  const types = ['All', ...new Set(menu.map((item) => item.type))]
  const favoriteCount = Object.values(favorites).filter(Boolean).length
  const visibleItems =
    activeType === 'All' ? menu : menu.filter((item) => item.type === activeType)

  return (
    <section id="menu" className="mx-auto max-w-[1100px] px-6 py-12">
      <h2 className="mt-6 mb-4 text-[1.75rem] font-bold">Our Menu</h2>

      {status === 'loading' && <p className="text-ink-soft">Loading the menu…</p>}

      {status === 'error' && (
        <p className="rounded-[0.6rem] border border-line bg-surface-2 px-4 py-3 text-ink-soft" role="alert">
          Sorry, we couldn't load the menu right now. Please try again in a moment.
        </p>
      )}

      {status === 'ready' && (
        <>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter menu by type">
            {types.map((type) => {
              const isActive = type === activeType
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  aria-pressed={isActive}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-ink bg-ink text-white'
                      : 'border-line bg-white text-ink hover:border-ink'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>

          <p className="mb-4 text-sm text-ink-soft" aria-live="polite">
            Showing {visibleItems.length} of {menu.length} dishes · {favoriteCount} saved
          </p>

          {orderError && (
            <p className="mb-4 rounded-[0.6rem] border border-ink bg-surface-2 px-4 py-3 text-sm" role="alert">
              {orderError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                isFavorite={Boolean(favorites[item.id])}
                onFavoriteChange={(isOn) => setFavorite(item.id, isOn)}
                onOrder={() => handleOrder(item.id)}
                isOrdering={orderingId === item.id}
              />
            ))}
          </div>
        </>
      )}

      {/* Same sign-in pop-up as the header, opened when an order needs a signed-in user */}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false)
          setOrderError('')
        }}
      />
    </section>
  )
}
