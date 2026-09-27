type SkeletonProps = {
  className?: string
  label?: string
}

export function Skeleton({ className = '', label = 'Загрузка' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#e4e6ee] ${className}`}
      role="status"
      aria-label={label}
    />
  )
}
