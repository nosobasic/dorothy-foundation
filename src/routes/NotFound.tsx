import { Link } from 'react-router-dom'
import Hero from '@/components/common/Hero'

export default function NotFound() {
  return (
    <div>
      <Hero title="404" subtitle="Page Not Found" height="medium" />
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </section>
    </div>
  )
}

