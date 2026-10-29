export default function ProductCard({ name, image, alt, category, price }) {
  return (
    <article className="product-card">
      <img src={`/images/${image}`} alt={alt} />
      <h3>{name}</h3>
      <p className="category">{category}</p>
      <p className="price">${price.toFixed(2)}</p>
    </article>
  )
}
