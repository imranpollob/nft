interface PricePillProps {
  price: number
}

export function PricePill({ price }: PricePillProps) {
  return (
    <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium">
      {price.toFixed(4)} ETH/h
    </div>
  )
}