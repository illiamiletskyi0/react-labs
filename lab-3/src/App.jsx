import { menu } from './data.js'
import MenuTable from './components/MenuTable.jsx'
import SearchBar from './components/SearchBar.jsx'

export default function App() {
  return (
    <main className="app">
      <h1>Меню кав'ярні</h1>

      <SearchBar />

      <MenuTable menu={menu} />
    </main>
  )
}
