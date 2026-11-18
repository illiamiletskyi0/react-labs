import { createContext, use, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

export default function Tabs({
  defaultValue,
  children,
  className = '',
  ...props
}) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)

  const contextValue = {
    selectedTab,
    setSelectedTab,
  }

  return (
    <TabsContext value={contextValue}>
      <div className={className ? `tabs ${className}` : 'tabs'} {...props}>
        {children}
      </div>
    </TabsContext>
  )
}

function List({ children, className = '', ...props }) {
  useTabsContext()
  return (
    <div
      className={className ? `tab-list ${className}` : 'tab-list'}
      {...props}
    >
      {children}
    </div>
  )
}

function Tab({ value, children, className = '', onClick, ...props }) {
  const { selectedTab, setSelectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  const handleClick = (e) => {
    onClick?.(e)
    setSelectedTab(value)
  }

  const classNames = [className, isSelected ? 'active' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classNames || undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

function Panel({ value, children, ...props }) {
  const { selectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  return (
    <div hidden={!isSelected} {...props}>
      {children}
    </div>
  )
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel
