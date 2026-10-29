import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  guests: '2',
  date: '',
  time: '',
  seating: 'Main Dining Room',
  notes: '',
}

const lunchSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM']
const dinnerSlots = ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM']

const fieldClass =
  'w-full rounded-[0.6rem] border border-line bg-surface-2 px-3.5 py-3 text-[0.95rem] text-ink [color-scheme:light] transition focus:border-ink focus:bg-white focus:shadow-[0_0_0_3px_rgba(17,17,17,0.1)] focus:outline-none'
const labelClass = 'text-[0.85rem] font-semibold tracking-[0.01em]'
const groupClass = 'flex flex-col gap-1.5'
const rowClass = 'grid grid-cols-1 gap-5 sm:grid-cols-2'

export default function Reservation() {
  const [form, setForm] = useState(initialForm)
  const [confirmed, setConfirmed] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setConfirmed(form)
    setForm(initialForm)
  }

  return (
    <section id="reservation" className="mx-auto max-w-[1100px] border-t border-line px-6 py-16">
      <div className="mb-10 text-center">
        <p className="mb-4 text-[0.8rem] tracking-[0.15em] text-clay uppercase">Table Reservation · Dine With Us</p>
        <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Book a <span>Table</span></h2>
        <p className="mx-auto mt-2 max-w-[38rem] text-[1.05rem] leading-normal text-ink-soft">
          Reserve your table or seat at our sushi counter. Experience fresh flavors prepared with passion and precision.
        </p>
      </div>

      <div className="mx-auto flex max-w-[700px] flex-col rounded-2xl border border-line bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
        {confirmed && (
          <p className="mb-6 rounded-[0.6rem] border border-ink bg-surface-2 px-4 py-3.5" role="status">
            Thanks, {confirmed.name}! Your table for {confirmed.guests} on {confirmed.date} at {confirmed.time} is requested.
          </p>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={rowClass}>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-name">Full Name *</label>
              <input className={fieldClass} type="text" id="res-name" name="name" placeholder="John Doe" required value={form.name} onChange={handleChange} />
            </div>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-email">Email Address *</label>
              <input className={fieldClass} type="email" id="res-email" name="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className={rowClass}>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-phone">Phone Number *</label>
              <input className={fieldClass} type="tel" id="res-phone" name="phone" placeholder="+1 (555) 000-0000" required value={form.phone} onChange={handleChange} />
            </div>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-guests">Number of Guests *</label>
              <select className={`${fieldClass} cursor-pointer`} id="res-guests" name="guests" required value={form.guests} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={rowClass}>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-date">Date *</label>
              <input className={fieldClass} type="date" id="res-date" name="date" required value={form.date} onChange={handleChange} />
            </div>
            <div className={groupClass}>
              <label className={labelClass} htmlFor="res-time">Time Slot *</label>
              <select className={`${fieldClass} cursor-pointer`} id="res-time" name="time" required value={form.time} onChange={handleChange}>
                <option value="" disabled>Select Time Slot</option>
                <optgroup label="Lunch">
                  {lunchSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </optgroup>
                <optgroup label="Dinner">
                  {dinnerSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              </select>
            </div>
          </div>

          <div className={groupClass}>
            <label className={labelClass} htmlFor="res-seating">Seating Preference</label>
            <select className={`${fieldClass} cursor-pointer`} id="res-seating" name="seating" value={form.seating} onChange={handleChange}>
              <option value="Main Dining Room">Main Dining Room</option>
              <option value="Sushi Counter">Sushi Counter (Chef's View)</option>
              <option value="Private Booth">Private Booth</option>
              <option value="Outdoor Terrace">Outdoor Terrace</option>
            </select>
          </div>

          <div className={groupClass}>
            <label className={labelClass} htmlFor="res-notes">Special Requests / Dietary Notes</label>
            <textarea className={`${fieldClass} min-h-[85px] resize-y`} id="res-notes" name="notes" rows="3" placeholder="Dietary restrictions, allergies, special celebration..." value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="mt-2 w-full cursor-pointer rounded-full bg-ink px-7 py-3.5 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#333333]">Confirm Reservation</button>
        </form>
      </div>
    </section>
  )
}
