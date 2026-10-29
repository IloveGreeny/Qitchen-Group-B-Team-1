import FavoriteToggle from './FavoriteToggle.jsx'

export default function ProductCard({ name, image, alt, description, price, isFavorite, onFavoriteChange }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white transition hover:border-[#d4d4d4] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      <div className="relative">
        <img src={`/images/${image}`} alt={alt} className="h-60 w-full object-cover" />
        <div className="absolute top-3 right-3">
          <FavoriteToggle isOn={isFavorite} onChange={onFavoriteChange} label={name} />
        </div>
      </div>
      <h3 className="mx-4 mt-4 mb-1 text-[1.05rem] font-semibold">{name}</h3>
      <p className="mx-4 text-[0.8rem] text-ink-soft">{description}</p>
      <p className="mx-4 mt-2 mb-4 text-[0.95rem] font-semibold">${price.toFixed(2)}</p>
    </article>
  )
}
