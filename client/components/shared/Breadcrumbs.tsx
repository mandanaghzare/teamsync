import Link from "next/link"
import { ChevronRight } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLastItem ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLastItem
                    ? "font-medium text-foreground"
                    : undefined
                }
              >
                {item.label}
              </span>
            )}

            {!isLastItem && (
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}