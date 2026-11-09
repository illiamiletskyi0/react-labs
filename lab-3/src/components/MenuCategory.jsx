import MenuItemRow from './MenuItemRow.jsx'

export default function MenuCategory({ category, inStockOnly }) {
  const items = inStockOnly
    ? category.items.filter((item) => item.available)
    : category.items
  return (
    <tbody>
      <tr className="category">
        <th colSpan={2} scope="rowgroup">
          {category.name} ({items.length})
        </th>
      </tr>
      {items.map((item) => (
        <MenuItemRow key={item.id} item={item} />
      ))}
    </tbody>
  )
}
