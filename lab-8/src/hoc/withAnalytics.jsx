import { track } from '../analytics.js'

export function withAnalytics(Component, event) {
  function WithAnalytics({ analyticsData, onClick, ...props }) {
    const handleClick = (clickEvent) => {
      track(event, analyticsData)
      onClick?.(clickEvent)
    }

    return <Component {...props} onClick={handleClick} />
  }

  const componentName = Component.displayName || Component.name || 'Component'
  WithAnalytics.displayName = `withAnalytics(${componentName})`

  return WithAnalytics
}
