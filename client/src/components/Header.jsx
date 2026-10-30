import { useState } from 'react'
import { navLinks } from '../data/navLinks.js'
import { useSession, signOut } from '../lib/auth-client.js'
import AuthDialog from './AuthDialog.jsx'

export default function Header() {
  // useSession asks the server "who is logged in?" using the session cookie,
  // so the signed-in state survives a page refresh.
  const { data: session, isPending } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white">
      <nav className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between sm:px-6">
        <a href="/#home" className="text-[1.4rem] font-bold">
          <span>Q</span>itchen
        </a>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-ink-soft">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Fixed minimum width so the header doesn't jump while the session loads */}
          <div className="flex min-w-[6rem] items-center justify-center gap-3 sm:justify-end">
            {isPending ? null : session ? (
              <>
                <span className="max-w-[10rem] truncate text-sm text-ink-soft">Hi, {session.user.name}</span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="cursor-pointer rounded-full border border-ink px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="cursor-pointer rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  )
}
