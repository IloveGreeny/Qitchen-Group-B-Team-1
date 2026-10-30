import FavoriteToggle from './FavoriteToggle.jsx'

export default function ProductCard({
  name,
  image,
  alt,
  description,
  price,
  isFavorite,
  onFavoriteChange,
  onOrder,
  isOrdering,
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-[#d4d4d4] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      <div className="relative">
        <img src={`/images/${image}`} alt={alt} className="h-60 w-full object-cover" />
        <div className="absolute top-3 right-3">
          <FavoriteToggle isOn={isFavorite} onChange={onFavoriteChange} label={name} />
        </div>
      </div>
      <h3 className="mx-4 mt-4 mb-1 text-[1.05rem] font-semibold">{name}</h3>
      <p className="mx-4 text-[0.8rem] text-ink-soft">{description}</p>

      {/* mt-auto pushes this row to the bottom so buttons line up across cards */}
      <div className="mx-4 mt-auto flex items-center justify-between gap-3 pt-3 pb-4">
        <p className="text-[0.95rem] font-semibold">${price.toFixed(2)}</p>
        <button
          type="button"
          onClick={onOrder}
          disabled={isOrdering}
          className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-wait disabled:opacity-60"
        >
          {isOrdering ? 'Redirecting…' : 'Order now'}
        </button>
      </div>
    </article>
  )
}
