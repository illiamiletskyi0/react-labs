import Avatar from './Avatar.jsx'
import Badge from './Badge.jsx'

export default function Profile({ person }) {
  return (
    <article className="profile">
      <Avatar person={person} />
      <h3>{person.name}</h3>
      <p>{person.role}</p>
      {person.isLead && <Badge>Тімлідка</Badge>}
    </article>
  )
}
