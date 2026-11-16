import { formatTime } from '../formatTime.js'

/**
 * Простий (presentational) компонент таймера: лише показує те, що отримав у
 * props, і викликає передані обробники. Власного стану й ефектів не має.
 *
 * Використання:
 *   <TimerView
 *     method={method}
 *     secondsLeft={175}
 *     status="running"   // 'idle' | 'running' | 'paused' | 'done'
 *     onStart={…}
 *     onPause={…}
 *     onReset={…}
 *   />
 *
 * Вимоги — у тестах tests/TimerView.test.jsx.
 */
export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  let firstLabel = 'Старт'
  let onFirstClick = onStart

  if (status === 'running') {
    firstLabel = 'Пауза'
    onFirstClick = onPause
  } else if (status === 'paused') {
    firstLabel = 'Продовжити'
  } else if (status === 'done') {
    firstLabel = 'Спочатку'
    onFirstClick = onReset
  }

  const showReset = status === 'running' || status === 'paused'

  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p className="time" role="timer">
        {formatTime(secondsLeft)}
      </p>
      <p className="timer-done" role="status">
        {status === 'done' ? 'Готово! Час пити каву.' : null}
      </p>
      <div className="timer-controls">
        <button type="button" onClick={onFirstClick}>
          {firstLabel}
        </button>
        {showReset && (
          <button type="button" onClick={onReset}>
            Скинути
          </button>
        )}
      </div>
    </article>
  )
}
