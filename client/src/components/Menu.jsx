import { useState } from 'react'
import { menu } from '../data/menu.js'
import ProductCard from './ProductCard.jsx'

// 'All' plus every type that appears in the data, in order
const types = ['All', ...new Set(menu.map((item) => item.type))]

export default function Menu() {
  const [activeType, setActiveType] = useState('All')
  // { [itemId]: true } for every dish the user has hearted
  const [favorites, setFavorites] = useState({})

  function setFavorite(id, isOn) {
    setFavorites((prev) => ({ ...prev, [id]: isOn }))
  }

  const favoriteCount = Object.values(favorites).filter(Boolean).length

  const visibleItems =
    activeType === 'All' ? menu : menu.filter((item) => item.type === activeType)

  return (
    <section id="menu" className="mx-auto max-w-[1100px] px-6 py-12">
      <h2 className="mt-6 mb-4 text-[1.75rem] font-bold">Our Menu</h2>

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item) => (
          <ProductCard
            key={item.id}
            {...item}
            isFavorite={Boolean(favorites[item.id])}
            onFavoriteChange={(isOn) => setFavorite(item.id, isOn)}
          />
        ))}
      </div>
    </section>
  )
}
