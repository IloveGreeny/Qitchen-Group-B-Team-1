import { navLinks } from '../data/navLinks.js'

export default function Header() {
  return (
    <header>
      <nav>
        <a href="#home" className="logo"><span>Q</span>itchen</a>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
