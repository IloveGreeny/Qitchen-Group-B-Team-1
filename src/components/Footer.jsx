import { navLinks } from '../data/navLinks.js'

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo"><span>Q</span>itchen</p>
          <p>Fresh sushi craft and unforgettable dining experiences.</p>
        </div>

        <div className="footer-links">
          <h3>Navigation</h3>
          <ul>
            {navLinks
              .filter((link) => link.href !== '#contact')
              .map((link) => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
          </ul>
        </div>

        <div className="footer-hours">
          <h3>Opening Hours</h3>
          <p><strong>Lunch:</strong> Tue – Sun: 12:00 PM – 3:00 PM</p>
          <p><strong>Dinner:</strong> Tue – Sun: 5:30 PM – 10:30 PM</p>
          <p className="closed-tag"><strong>Monday:</strong> Closed</p>
        </div>

        <div className="footer-contact">
          <h3>Location & Contact</h3>
          <p>123 Roastery Lane, Portland</p>
          <p>+1 (555) 234-5678</p>
          <p>hello@qitchen.example</p>
        </div>
      </div>

      <p className="copyright">© 2026 Qitchen, Built as a learning project</p>
    </footer>
  )
}
