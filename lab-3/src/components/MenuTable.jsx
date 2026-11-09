import MenuCategory from './MenuCategory.jsx'

export default function MenuTable({ menu, inStockOnly }) {
  return (
    <table className="menu-table">
      <thead>
        <tr>
          <th scope="col">Позиція</th>
          <th scope="col">Ціна</th>
        </tr>
      </thead>
      {menu.map((category) => (
        <MenuCategory
          key={category.id}
          category={category}
          inStockOnly={inStockOnly}
        />
      ))}
    </table>
  )
}
