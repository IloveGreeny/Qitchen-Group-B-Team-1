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
    <section id="reservation" className="reservation">
      <div className="reservation-header">
        <p className="eyebrow">Table Reservation · Dine With Us</p>
        <h2>Book a <span>Table</span></h2>
        <p className="reservation-intro">
          Reserve your table or seat at our sushi counter. Experience fresh flavors prepared with passion and precision.
        </p>
      </div>

      <div className="reservation-card reservation-form-card">
        {confirmed && (
          <p className="res-confirmation" role="status">
            Thanks, {confirmed.name}! Your table for {confirmed.guests} on {confirmed.date} at {confirmed.time} is requested.
          </p>
        )}

        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="res-name">Full Name *</label>
              <input type="text" id="res-name" name="name" placeholder="John Doe" required value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="res-email">Email Address *</label>
              <input type="email" id="res-email" name="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="res-phone">Phone Number *</label>
              <input type="tel" id="res-phone" name="phone" placeholder="+1 (555) 000-0000" required value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="res-guests">Number of Guests *</label>
              <select id="res-guests" name="guests" required value={form.guests} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="res-date">Date *</label>
              <input type="date" id="res-date" name="date" required value={form.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="res-time">Time Slot *</label>
              <select id="res-time" name="time" required value={form.time} onChange={handleChange}>
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

          <div className="form-group">
            <label htmlFor="res-seating">Seating Preference</label>
            <select id="res-seating" name="seating" value={form.seating} onChange={handleChange}>
              <option value="Main Dining Room">Main Dining Room</option>
              <option value="Sushi Counter">Sushi Counter (Chef's View)</option>
              <option value="Private Booth">Private Booth</option>
              <option value="Outdoor Terrace">Outdoor Terrace</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="res-notes">Special Requests / Dietary Notes</label>
            <textarea id="res-notes" name="notes" rows="3" placeholder="Dietary restrictions, allergies, special celebration..." value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="btn res-submit-btn">Confirm Reservation</button>
        </form>
      </div>
    </section>
  )
}
