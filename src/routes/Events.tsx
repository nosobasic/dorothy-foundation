import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Hero from '@/components/common/Hero'
import api from '@/lib/api'
import { Event } from '@/lib/types'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/events')
      .then((res) => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading events:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <Hero title="Events" subtitle="Join us in making a difference" height="medium" />

      <section className="py-16 bg-white">
        <div className="container-custom">
          {loading ? (
            <p className="text-center text-gray-600">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm bg-muted-gold/10 text-muted-gold rounded-full">
                      {format(new Date(event.start_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </p>
                  )}
                  {event.summary && <p className="text-gray-600 mb-4">{event.summary}</p>}
                  <span className="text-muted-gold font-medium">Learn More →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No upcoming events at this time.</p>
              <p className="text-gray-500">Check back soon for new events and opportunities!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

