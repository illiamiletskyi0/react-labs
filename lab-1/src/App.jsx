import ProfileCard from './components/ProfileCard.jsx'

const TECHNOLOGIES = ['React', 'Next.js', 'TypeScript']

function App() {
  return (
    <main className="app">
      <ProfileCard
        name="Мілецький Ілля"
        group="КН-311"
        technologies={TECHNOLOGIES}
      />
    </main>
  )
}

export default App
