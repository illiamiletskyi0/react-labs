import { useState } from 'react'
import './ProfileCard.css'

function ProfileCard({ name, group, technologies = [] }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <h1>{name}</h1>
      <p className="profile-card__group">Група: {group}</p>

      <h2>Технології, які хочу опанувати</h2>
      <ul className="profile-card__technologies">
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>

      <button
        type="button"
        className="profile-card__like"
        onClick={() => setLikes((current) => current + 1)}
      >
        Подобається
        <span className="profile-card__likes" aria-live="polite">
          {likes}
        </span>
      </button>
    </article>
  )
}

export default ProfileCard
