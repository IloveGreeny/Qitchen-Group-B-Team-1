import { menu } from '../data/menu.js'
import ProductCard from './ProductCard.jsx'

export default function Menu() {
  return (
    <section id="shop" className="shop">
      {menu.map((section) => (
        <div key={section.title}>
          <h2>{section.title}</h2>
          <div className="product-grid">
            {section.items.map((item) => (
              <ProductCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
