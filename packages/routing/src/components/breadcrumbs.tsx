import { useBreadcrumbs } from '../hooks/use-router'
import type { BreadcrumbItem, RouteMeta } from '../types/router'

interface BreadcrumbsProps {
  meta?: RouteMeta
  className?: string
  separator?: React.ReactNode
  renderItem?: (item: BreadcrumbItem, index: number) => React.ReactNode
  maxItems?: number
}

export function Breadcrumbs({
  meta,
  className = '',
  separator = '/',
  renderItem,
  maxItems,
}: BreadcrumbsProps) {
  const breadcrumbs = useBreadcrumbs(meta)

  // Limit breadcrumbs if maxItems is specified
  const displayBreadcrumbs =
    maxItems && breadcrumbs.length > maxItems
      ? [breadcrumbs[0], { label: '...', path: undefined }, ...breadcrumbs.slice(-maxItems + 2)]
      : breadcrumbs

  const defaultRenderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === displayBreadcrumbs.length - 1

    if (item.path && !isLast) {
      return (
        <a href={item.path} className="text-blue-600 transition-colors hover:text-blue-800">
          {item.icon && <span className="mr-1">{item.icon}</span>}
          {item.label}
        </a>
      )
    }

    return (
      <span className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}>
        {item.icon && <span className="mr-1">{item.icon}</span>}
        {item.label}
      </span>
    )
  }

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {displayBreadcrumbs.map((item, index) => (
          <li key={`${item.path}-${index}`} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
          </li>
        ))}
      </ol>
    </nav>
  )
}
