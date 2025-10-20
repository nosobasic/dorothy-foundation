interface ValueCardProps {
  title: string
  description: string
}

export default function ValueCard({ title, description }: ValueCardProps) {
  return (
    <div className="card text-center">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

