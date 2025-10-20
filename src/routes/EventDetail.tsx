import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Hero from '@/components/common/Hero'
import { FormField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { Event } from '@/lib/types'
import { useToastStore } from '@/lib/store'

const rsvpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type RSVPForm = z.infer<typeof rsvpSchema>

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPForm>({
    resolver: zodResolver(rsvpSchema),
  })

  useEffect(() => {
    if (id) {
      api
        .get(`/api/events/${id}`)
        .then((res) => {
          setEvent(res.data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error loading event:', error)
          setLoading(false)
        })
    }
  }, [id])

  const onSubmit = async (data: RSVPForm) => {
    setSubmitting(true)
    try {
      const response = await api.post(`/api/events/${id}/rsvp`, data)
      if (response.data.external_url) {
        window.location.href = response.data.external_url
      } else {
        showToast('RSVP submitted successfully!', 'success')
        reset()
      }
    } catch (error) {
      showToast('Failed to submit RSVP. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Hero title="Loading..." height="small" />
        <div className="container-custom py-16 text-center">
          <p>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div>
        <Hero title="Event Not Found" height="small" />
        <div className="container-custom py-16 text-center">
          <p className="mb-4">Sorry, we couldn't find that event.</p>
          <Link to="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Hero title={event.title} height="medium" />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Date & Time</h3>
              <p className="text-lg">{format(new Date(event.start_at), 'PPPp')}</p>
              {event.end_at && (
                <p className="text-sm text-gray-600 mt-1">
                  Until {format(new Date(event.end_at), 'PPPp')}
                </p>
              )}
            </div>
            {event.location && (
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h3>
                <p className="text-lg">{event.location}</p>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose prose-lg max-w-none mb-12">
              <h2>About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}

          <div className="card bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Register for This Event</h2>
            {event.external_registration_url ? (
              <div>
                <p className="mb-4">This event uses external registration.</p>
                <a
                  href={event.external_registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Register Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  label="Your Name"
                  type="text"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
                <FormField
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

