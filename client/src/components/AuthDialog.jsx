import { useEffect, useRef, useState } from 'react'
import { signIn, signUp } from '../lib/auth-client.js'

const fieldClass =
  'w-full rounded-[0.6rem] border border-line bg-surface-2 px-3.5 py-3 text-[0.95rem] text-ink transition focus:border-ink focus:bg-white focus:shadow-[0_0_0_3px_rgba(17,17,17,0.1)] focus:outline-none'
const labelClass = 'text-[0.85rem] font-semibold'

const emptyForm = { name: '', email: '', password: '' }

// A pop-up with two modes: "signin" and "signup".
// The parent decides when it is open (isOpen) and what closing does (onClose).
export default function AuthDialog({ isOpen, onClose }) {
  const dialogRef = useRef(null)
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // <dialog> must be opened/closed through its DOM methods, so sync it with isOpen
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
  }

  function handleClose() {
    setForm(emptyForm)
    setError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const { error } =
      mode === 'signup'
        ? await signUp.email({ name: form.name, email: form.email, password: form.password })
        : await signIn.email({ email: form.email, password: form.password })

    setIsSubmitting(false)

    if (error) {
      setError(error.message || 'Something went wrong. Please try again.')
      return
    }
    handleClose() // success: useSession() in the Header updates by itself
  }

  const isSignup = mode === 'signup'

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="auth-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-6 text-ink shadow-[0_20px_40px_rgba(0,0,0,0.15)] backdrop:bg-black/50 sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 id="auth-title" className="text-2xl font-bold">
          {isSignup ? 'Create an account' : 'Sign in'}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="cursor-pointer rounded-full px-2 text-2xl leading-none text-ink-soft hover:text-ink"
        >
          ×
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-[0.6rem] border border-ink bg-surface-2 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {isSignup && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-name" className={labelClass}>Name</label>
            <input id="auth-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} className={fieldClass} />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-email" className={labelClass}>Email</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-password" className={labelClass}>Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            minLength={8}
            required
            value={form.password}
            onChange={handleChange}
            className={fieldClass}
          />
          {isSignup && <p className="text-xs text-ink-soft">At least 8 characters.</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        {isSignup ? 'Already have an account?' : 'New to Qitchen?'}{' '}
        <button
          type="button"
          onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
          className="cursor-pointer font-semibold text-ink underline underline-offset-2"
        >
          {isSignup ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </dialog>
  )
}
