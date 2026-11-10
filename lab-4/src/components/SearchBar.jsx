export default function SearchBar({ filterText, inStockOnly }) {
  return (
    <search className="search-bar">
      <input
        type="search"
        value={filterText}
        placeholder="Пошук у меню"
        aria-label="Пошук у меню"
      />
      <label>
        <input type="checkbox" checked={inStockOnly}/> Лише в наявності
      </label>
    </search>
  )
}
