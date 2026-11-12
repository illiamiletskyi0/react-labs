import GuestsStepper from './GuestsStepper.jsx'
import { useRef, useState, useEffect } from 'react'
import { describeBooking } from '../describeBooking.js'

export default function BookingForm() {
  const [booking, setBooking] = useState(null)
  const [comment, setComment] = useState('')
  const [guests, setGuests] = useState(2)
  const [isDirty, setIsDirty] = useState(false)
  const nameRef = useRef(null)

  function handleReset() {
    setBooking(null)
    setComment('')
    setGuests(2)
    nameRef.current.focus()
    setIsDirty(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setBooking(Object.fromEntries(formData))
    setIsDirty(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  useEffect(() => {
    if (!isDirty) return

    function handleBeforeUnload(e) {
      e.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      onReset={handleReset}
      onInput={() => setIsDirty(true)}
    >
      <label>
        Ім'я
        <input name="name" autoComplete="name" ref={nameRef} required />
      </label>
      <div className="row">
        <label>
          Дата
          <input type="date" name="date" required />
        </label>
        <label>
          Час
          <input type="time" name="time" required />
        </label>
      </div>
      <GuestsStepper value={guests} onChange={setGuests} />
      <label>
        Коментар
        <textarea
          name="comment"
          maxLength={200}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit">Забронювати</button>
        <button type="reset">Очистити</button>
      </div>
      <p role="status" className="status">
        {booking && describeBooking(booking)}
      </p>
    </form>
  )
}
