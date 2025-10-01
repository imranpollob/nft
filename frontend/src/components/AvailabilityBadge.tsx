interface AvailabilityBadgeProps {
  available: boolean
}

export function AvailabilityBadge({ available }: AvailabilityBadgeProps) {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${available
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
        }`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-1 ${available ? 'bg-green-400' : 'bg-red-400'
          }`}
      />
      {available ? 'Available' : 'Unavailable'}
    </div>
  )
}