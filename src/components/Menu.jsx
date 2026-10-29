import { menu } from '../data/menu.js'
import ProductCard from './ProductCard.jsx'

export default function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-[1100px] px-6 py-12">
      {menu.map((section) => (
        <div key={section.title}>
          <h2 className="mt-6 mb-6 text-[1.75rem] font-bold">{section.title}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item) => (
              <ProductCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
