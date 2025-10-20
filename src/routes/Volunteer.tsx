import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Hero from '@/components/common/Hero'
import { FormField, TextAreaField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { useToastStore } from '@/lib/store'

const volunteerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  interests: z.string().min(10, 'Please tell us about your interests (at least 10 characters)'),
})

type VolunteerForm = z.infer<typeof volunteerSchema>

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
  })

  const onSubmit = async (data: VolunteerForm) => {
    setSubmitting(true)
    try {
      await api.post('/api/contact', {
        name: data.name,
        email: data.email,
        subject: 'Volunteer Application',
        message: `Phone: ${data.phone || 'Not provided'}\n\nInterests:\n${data.interests}`,
      })
      setSubmitted(true)
      reset()
      showToast('Application submitted successfully!', 'success')
    } catch (error) {
      showToast('Failed to submit application. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Hero
        title="Volunteer"
        subtitle="Join us in making a difference in our community"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Volunteer With Us?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Volunteers are the heart of The Dorothy R. Morgan Foundation. Your time and talents
              help us honor Dorothy's memory and support our mission to transform loss into light.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Event Support</h3>
                <p className="text-gray-600">
                  Help organize and run our community events, fundraisers, and memorial activities.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Mentorship</h3>
                <p className="text-gray-600">
                  Guide and support young people through our youth programs and scholarship
                  initiatives.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Administrative</h3>
                <p className="text-gray-600">
                  Assist with office tasks, communications, and helping our organization run
                  smoothly.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Fundraising</h3>
                <p className="text-gray-600">
                  Help with grant writing, donor outreach, and organizing fundraising campaigns.
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="card bg-green-50 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold mb-3 text-green-900">
                Thank You for Your Interest!
              </h3>
              <p className="text-green-800">
                We've received your volunteer application and will be in touch soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-green-700 underline"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Volunteer Application</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  label="Full Name"
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
                <FormField
                  label="Phone Number"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <TextAreaField
                  label="Tell us about your interests and how you'd like to help"
                  {...register('interests')}
                  error={errors.interests?.message}
                  required
                />
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

