// Controlled toggle: it holds no state of its own.
// The parent passes `isOn` and decides what happens in `onChange`.
export default function FavoriteToggle({ isOn, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!isOn)}
      aria-pressed={isOn}
      aria-label={isOn ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-5 ${isOn ? 'fill-ink stroke-ink' : 'fill-none stroke-ink'}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s-7-4.35-9.5-8.5C.9 9.6 2.4 5.5 6.3 5.5c2.2 0 3.6 1.3 4.2 2.5h3c.6-1.2 2-2.5 4.2-2.5 3.9 0 5.4 4.1 3.8 7C19 16.65 12 21 12 21z" />
      </svg>
    </button>
  )
}
