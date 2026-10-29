import { navLinks } from '../data/navLinks.js'

const headingClass = 'mb-3.5 text-[0.95rem] font-bold'
const textClass = 'mb-1.5 text-[0.88rem] leading-relaxed text-ink-soft'

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-6 pt-14 pb-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.3fr_0.9fr_1.2fr_1.1fr] lg:gap-8">
        <div>
          <p className="text-[1.1rem] font-bold"><span>Q</span>itchen</p>
          <p className="mt-2 max-w-sm text-[0.9rem] text-ink-soft">Fresh sushi craft and unforgettable dining experiences.</p>
        </div>

        <div>
          <h3 className={headingClass}>Navigation</h3>
          <ul className="flex flex-col gap-2">
            {navLinks
              .filter((link) => link.href !== '/#contact')
              .map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[0.9rem] text-ink-soft transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Opening Hours</h3>
          <p className={textClass}><strong className="font-semibold text-ink">Lunch:</strong> Tue – Sun: 12:00 PM – 3:00 PM</p>
          <p className={textClass}><strong className="font-semibold text-ink">Dinner:</strong> Tue – Sun: 5:30 PM – 10:30 PM</p>
          <p className={textClass}><strong className="font-semibold text-ink">Monday:</strong> Closed</p>
        </div>

        <div>
          <h3 className={headingClass}>Location & Contact</h3>
          <p className={textClass}>123 Roastery Lane, Portland</p>
          <p className={textClass}>+1 (555) 234-5678</p>
          <p className={`${textClass} break-words`}>hello@qitchen.example</p>
        </div>
      </div>

      <p className="mx-auto max-w-[1100px] border-t border-line px-6 pt-5 pb-8 text-[0.8rem] text-clay">
        © 2026 Qitchen, Built as a learning project
      </p>
    </footer>
  )
}
