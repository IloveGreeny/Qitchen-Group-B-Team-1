import { menu } from '../data/menu.js'
import ProductCard from './ProductCard.jsx'

export default function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-[1100px] px-6 py-12">
      <h2 className="mt-6 mb-6 text-[1.75rem] font-bold">Our Menu</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {menu.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
