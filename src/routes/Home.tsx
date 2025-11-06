import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Hero from '@/components/common/Hero'
import ValueCard from '@/components/common/ValueCard'
import { CORE_VALUES } from '@/lib/content'
import api from '@/lib/api'
import { Event } from '@/lib/types'
import { format } from 'date-fns'

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  useEffect(() => {
    api
      .get('/api/events')
      .then((res) => setUpcomingEvents(res.data.slice(0, 3)))
      .catch(console.error)
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="The Dorothy R. Morgan Foundation"
        subtitle="From Loss to Light"
        height="large"
        backgroundImage="/hero-tribute-in-light.jpg"
        overlayImage="/drm-image4.png"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 md:mt-8 px-4">
          <Link to="/donate" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
            Donate Now
          </Link>
          <Link to="/events" className="btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-deep-navy text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
            See Upcoming Events
          </Link>
        </div>
      </Hero>

      {/* Core Values */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Our Core Values</h2>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {CORE_VALUES.map((value) => (
              <ValueCard key={value.title} title={value.title} description={value.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {format(new Date(event.start_at), 'PPP')}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                  )}
                  {event.summary && <p className="text-gray-600">{event.summary}</p>}
                  <span className="text-brand-purple font-medium mt-4 inline-block">
                    Learn More →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No upcoming events at this time. Check back soon!
            </p>
          )}
          <div className="text-center mt-8">
            <Link to="/events" className="btn-secondary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-deep-navy text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-white">
            Help Us Make a Difference
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Your support helps us honor Dorothy's memory by empowering families and youth in our
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/donate" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
              Make a Donation
            </Link>
            <Link to="/volunteer" className="btn-outline border-white text-white hover:bg-white hover:text-deep-navy text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

