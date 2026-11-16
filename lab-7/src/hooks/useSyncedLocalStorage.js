import { useCallback, useSyncExternalStore } from 'react'

// Підписники й останні знімки на кожен ключ живуть на рівні модуля: усі
// компоненти з одним ключем читають ті самі дані й чують ті самі зміни.
const listenersByKey = new Map()
const snapshotsByKey = new Map()

function listenersFor(key) {
  if (!listenersByKey.has(key)) {
    listenersByKey.set(key, new Set())
  }
  return listenersByKey.get(key)
}

function notify(key) {
  for (const listener of listenersFor(key)) {
    listener()
  }
}

function readSnapshot(key, initialValue) {
  const raw = localStorage.getItem(key)
  const cached = snapshotsByKey.get(key)

  // useSyncExternalStore порівнює знімки через Object.is, тож для того самого
  // raw треба повертати той самий результат, а не парсити щоразу заново.
  if (cached !== undefined && cached.raw === raw) {
    return cached.value
  }

  let value = initialValue

  if (raw !== null) {
    try {
      value = JSON.parse(raw)
    } catch {
      value = initialValue
    }
  }

  snapshotsByKey.set(key, { raw, value })
  return value
}

function subscribe(key, callback) {
  const listeners = listenersFor(key)
  listeners.add(callback)

  // `storage` приходить лише з інших вкладок. Вкладка, яка записала значення,
  // повідомляє своїх підписників сама — це робить setValue.
  const onStorage = (event) => {
    if (event.key === key) {
      callback()
    }
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

/**
 * Те саме, що useLocalStorage(key, initialValue), але всі компоненти з одним
 * ключем поділяють значення — і на сторінці, і в інших вкладках браузера.
 */
export function useSyncedLocalStorage(key, initialValue) {
  const subscribeToKey = useCallback(
    (callback) => subscribe(key, callback),
    [key],
  )
  const getSnapshot = useCallback(
    () => readSnapshot(key, initialValue),
    [key, initialValue],
  )

  const value = useSyncExternalStore(subscribeToKey, getSnapshot)

  const setValue = useCallback(
    (next) => {
      const current = readSnapshot(key, initialValue)
      const resolved = typeof next === 'function' ? next(current) : next
      localStorage.setItem(key, JSON.stringify(resolved))
      notify(key)
    },
    [key, initialValue],
  )

  return [value, setValue]
}
