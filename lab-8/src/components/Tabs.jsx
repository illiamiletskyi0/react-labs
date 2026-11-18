import { createContext, use, useId, useState } from 'react'

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
  const baseId = useId()

  const contextValue = {
    baseId,
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

function List({ children, className = '', onKeyDown, ...props }) {
  const { setSelectedTab } = useTabsContext()

  const handleKeyDown = (event) => {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll('[role="tab"]'),
    )
    const currentIndex = tabs.indexOf(document.activeElement)

    if (currentIndex === -1) {
      onKeyDown?.(event)
      return
    }

    let nextIndex

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      default:
        onKeyDown?.(event)
        return
    }

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    nextTab.focus()
    setSelectedTab(nextTab.dataset.value)
    onKeyDown?.(event)
  }

  return (
    <div
      role="tablist"
      className={className ? `tab-list ${className}` : 'tab-list'}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

function Tab({ value, children, className = '', onClick, ...props }) {
  const { baseId, selectedTab, setSelectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  const handleClick = (e) => {
    onClick?.(e)
    setSelectedTab(value)
  }

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      className={className || undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

function Panel({ value, children, ...props }) {
  const { baseId, selectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={!isSelected}
      {...props}
    >
      {children}
    </div>
  )
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel
