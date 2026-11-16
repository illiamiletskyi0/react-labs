import { useSyncedLocalStorage } from '../hooks/useSyncedLocalStorage.js'

export default function FavoriteButton({ productId, name }) {
  const [isFavorite, setIsFavorite] = useSyncedLocalStorage(
    `favorite:${productId}`,
    false,
  )

  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={`До обраного: ${name}`}
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite((current) => !current)}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}
