import { navLinks } from '../data/navLinks.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white">
      <nav className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between sm:px-6">
        <a href="#home" className="text-[1.4rem] font-bold">
          <span>Q</span>itchen
        </a>
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-ink-soft">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
