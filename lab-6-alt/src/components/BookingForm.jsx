import { startTransition, useActionState, useRef } from 'react'
import { useFormik } from 'formik'
import GuestsStepper from './GuestsStepper.jsx'
import { bookingSchema } from '../bookingSchema.js'
import { sendBooking } from '../api.js'

const defaultValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

const fieldOrder = ['name', 'phone', 'date', 'time']

function firstMessage(error) {
  return Array.isArray(error) ? error[0] : error
}

export default function BookingForm() {
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const refs = { name: nameRef, phone: phoneRef, date: dateRef, time: timeRef }
  const [result, dispatch, isPending] = useActionState(bookTable, null)

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: bookingSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      startTransition(() => dispatch(values))
    },
  })

  function errorFor(field) {
    if (!formik.touched[field]) return undefined
    return firstMessage(formik.errors[field])
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    if (isPending) return
    const errors = await formik.validateForm()
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.fromEntries(Object.keys(errors).map((field) => [field, true])),
      )
      const first = fieldOrder.find((field) => errors[field])
      refs[first]?.current?.focus()
      return
    }
    await formik.submitForm()
  }

  // Дія для useActionState: null — сигнал «Очистити»; інакше надсилаємо
  // бронювання, після успіху очищаємо форму й повертаємо відповідь.
  async function bookTable(previousResult, booking) {
    if (booking === null) return null
    const response = await sendBooking(booking)
    if (response.ok) startTransition(() => formik.resetForm())
    return response
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    nameRef.current.focus()
    formik.resetForm()
    startTransition(() => dispatch(null))
  }

  return (
    <form
      className="booking-form"
      noValidate
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            {...formik.getFieldProps('name')}
            ref={nameRef}
            autoComplete="name"
            required
            aria-invalid={errorFor('name') ? 'true' : 'false'}
            aria-describedby="name-error"
          />
        </label>
        <p id="name-error" className="field-error">
          {errorFor('name')}
        </p>
      </div>
      <div className="field">
        <label>
          Телефон
          <input
            type="tel"
            {...formik.getFieldProps('phone')}
            ref={phoneRef}
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={errorFor('phone') ? 'true' : 'false'}
            aria-describedby="phone-error"
          />
        </label>
        <p id="phone-error" className="field-error">
          {errorFor('phone')}
        </p>
      </div>
      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              type="date"
              {...formik.getFieldProps('date')}
              ref={dateRef}
              required
              aria-invalid={errorFor('date') ? 'true' : 'false'}
              aria-describedby="date-error"
            />
          </label>
          <p id="date-error" className="field-error">
            {errorFor('date')}
          </p>
        </div>
        <div className="field">
          <label>
            Час
            <input
              type="time"
              {...formik.getFieldProps('time')}
              ref={timeRef}
              required
              aria-invalid={errorFor('time') ? 'true' : 'false'}
              aria-describedby="time-error"
            />
          </label>
          <p id="time-error" className="field-error">
            {errorFor('time')}
          </p>
        </div>
      </div>
      <GuestsStepper
        value={formik.values.guests}
        onChange={(value) => formik.setFieldValue('guests', value)}
      />
      <label>
        Коментар
        <textarea
          {...formik.getFieldProps('comment')}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {formik.values.comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit" aria-disabled={isPending}>
          {isPending ? 'Надсилаємо…' : 'Забронювати'}
        </button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>
      <p
        role="status"
        className={result?.ok === false ? 'status error' : 'status'}
      >
        {result?.message}
      </p>
    </form>
  )
}
