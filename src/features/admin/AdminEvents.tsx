import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import * as Dialog from '@radix-ui/react-dialog'
import { FormField, TextAreaField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { Event } from '@/lib/types'
import { useToastStore } from '@/lib/store'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  description: z.string().optional(),
  start_at: z.string().min(1, 'Start date is required'),
  end_at: z.string().optional(),
  location: z.string().optional(),
  external_registration_url: z.string().url().optional().or(z.literal('')),
  is_published: z.boolean(),
})

type EventForm = z.infer<typeof eventSchema>

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  })

  const loadEvents = () => {
    api
      .get('/api/admin/events')
      .then((res) => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const onSubmit = async (data: EventForm) => {
    try {
      if (editingEvent) {
        await api.put(`/api/admin/events/${editingEvent.id}`, data)
        showToast('Event updated successfully', 'success')
      } else {
        await api.post('/api/admin/events', data)
        showToast('Event created successfully', 'success')
      }
      loadEvents()
      setDialogOpen(false)
      reset()
      setEditingEvent(null)
    } catch (error) {
      showToast('Failed to save event', 'error')
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    reset({
      ...event,
      start_at: new Date(event.start_at).toISOString().slice(0, 16),
      end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/api/admin/events/${id}`)
      showToast('Event deleted successfully', 'success')
      loadEvents()
    } catch (error) {
      showToast('Failed to delete event', 'error')
    }
  }

  const handleNew = () => {
    setEditingEvent(null)
    reset({
      title: '',
      summary: '',
      description: '',
      start_at: '',
      end_at: '',
      location: '',
      external_registration_url: '',
      is_published: false,
    })
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <button onClick={handleNew} className="btn-primary">
          Create Event
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{event.title}</td>
                    <td className="py-3 px-4">{format(new Date(event.start_at), 'PP')}</td>
                    <td className="py-3 px-4">{event.location || '-'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold mb-6">
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="Title"
                {...register('title')}
                error={errors.title?.message}
                required
              />
              <FormField
                label="Summary"
                {...register('summary')}
                error={errors.summary?.message}
              />
              <TextAreaField
                label="Description"
                {...register('description')}
                error={errors.description?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Start Date & Time"
                  type="datetime-local"
                  {...register('start_at')}
                  error={errors.start_at?.message}
                  required
                />
                <FormField
                  label="End Date & Time"
                  type="datetime-local"
                  {...register('end_at')}
                  error={errors.end_at?.message}
                />
              </div>
              <FormField
                label="Location"
                {...register('location')}
                error={errors.location?.message}
              />
              <FormField
                label="External Registration URL"
                type="url"
                {...register('external_registration_url')}
                error={errors.external_registration_url?.message}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                  {...register('is_published')}
                />
                <label htmlFor="is_published" className="ml-2 text-sm font-medium">
                  Publish event
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

