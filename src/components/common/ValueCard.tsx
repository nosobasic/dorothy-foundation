interface ValueCardProps {
  title: string
  description: string
}

export default function ValueCard({ title, description }: ValueCardProps) {
  return (
    <div className="card text-center">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  )
}

