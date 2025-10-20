import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Hero from '@/components/common/Hero'
import { FormField, TextAreaField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { useToastStore } from '@/lib/store'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const gallerySubmitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  uploader_name: z.string().min(1, 'Your name is required'),
  uploader_email: z.string().email('Invalid email address'),
  consent_signed: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
})

type GallerySubmitForm = z.infer<typeof gallerySubmitSchema>

export default function GallerySubmit() {
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToastStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GallerySubmitForm>({
    resolver: zodResolver(gallerySubmitSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
        showToast('Please select a JPG or PNG image', 'error')
        return
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        showToast('File size must be less than 10MB', 'error')
        return
      }
      setFile(selectedFile)
    }
  }

  const onSubmit = async (data: GallerySubmitForm) => {
    if (!file) {
      showToast('Please select a photo to upload', 'error')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', data.title)
      formData.append('uploader_name', data.uploader_name)
      formData.append('uploader_email', data.uploader_email)
      formData.append('consent_signed', 'true')
      if (data.description) {
        formData.append('description', data.description)
      }

      await api.post('/api/gallery/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      showToast('Photo submitted successfully! It will appear after approval.', 'success')
      navigate('/gallery')
    } catch (error) {
      showToast('Failed to submit photo. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Hero
        title="Submit a Photo"
        subtitle="Share your memories and support our community"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-2xl">
          <div className="card mb-8 bg-blue-50">
            <h3 className="font-semibold mb-2">Photo Submission Guidelines</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Only JPG and PNG files accepted</li>
              <li>Maximum file size: 10MB</li>
              <li>All photos will be reviewed before appearing in the gallery</li>
              <li>By submitting, you grant us permission to display your photo</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Upload Your Photo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">
                  Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="input"
                  required
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
              </div>

              <FormField
                label="Photo Title"
                type="text"
                {...register('title')}
                error={errors.title?.message}
                required
              />

              <TextAreaField
                label="Description (Optional)"
                placeholder="Tell us about this photo..."
                {...register('description')}
                error={errors.description?.message}
              />

              <FormField
                label="Your Name"
                type="text"
                {...register('uploader_name')}
                error={errors.uploader_name?.message}
                required
              />

              <FormField
                label="Your Email"
                type="email"
                {...register('uploader_email')}
                error={errors.uploader_email?.message}
                required
              />

              <div className="border-t pt-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent_signed"
                    className="mt-1 w-4 h-4 text-muted-gold border-gray-300 rounded focus:ring-muted-gold"
                    {...register('consent_signed')}
                  />
                  <label htmlFor="consent_signed" className="ml-2 text-sm text-gray-700">
                    I consent to The Dorothy R. Morgan Foundation displaying this photo in their
                    public gallery and promotional materials. I confirm that I have the right to
                    share this image.
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
                {errors.consent_signed && (
                  <p className="mt-1 text-sm text-red-500">{errors.consent_signed.message}</p>
                )}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Uploading...' : 'Submit Photo'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

