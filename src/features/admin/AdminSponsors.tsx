import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { FormField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { SponsorTier } from '@/lib/types'
import { useToastStore } from '@/lib/store'

const sponsorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount_cents: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0
  }, 'Amount must be a valid number'),
  benefits_json: z.string().optional(),
  is_active: z.boolean(),
})

type SponsorForm = z.infer<typeof sponsorSchema>

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<SponsorTier[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<SponsorTier | null>(null)
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SponsorForm>({
    resolver: zodResolver(sponsorSchema),
  })

  const loadSponsors = () => {
    api
      .get('/api/sponsors/admin')
      .then((res) => {
        setSponsors(res.data)
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    loadSponsors()
  }, [])

  const onSubmit = async (data: SponsorForm) => {
    try {
      const payload = {
        ...data,
        amount_cents: Math.round(parseFloat(data.amount_cents) * 100),
        benefits_json: data.benefits_json
          ? JSON.parse(data.benefits_json)
          : { benefits: [] },
      }

      if (editingSponsor) {
        await api.put(`/api/sponsors/admin/${editingSponsor.id}`, payload)
        showToast('Sponsor tier updated successfully', 'success')
      } else {
        await api.post('/api/sponsors/admin', payload)
        showToast('Sponsor tier created successfully', 'success')
      }
      loadSponsors()
      setDialogOpen(false)
      reset()
      setEditingSponsor(null)
    } catch (error) {
      showToast('Failed to save sponsor tier', 'error')
    }
  }

  const handleEdit = (sponsor: SponsorTier) => {
    setEditingSponsor(sponsor)
    reset({
      name: sponsor.name,
      amount_cents: (sponsor.amount_cents / 100).toString(),
      benefits_json: sponsor.benefits_json ? JSON.stringify(sponsor.benefits_json, null, 2) : '',
      is_active: sponsor.is_active,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsor tier?')) return
    try {
      await api.delete(`/api/sponsors/admin/${id}`)
      showToast('Sponsor tier deleted successfully', 'success')
      loadSponsors()
    } catch (error) {
      showToast('Failed to delete sponsor tier', 'error')
    }
  }

  const handleNew = () => {
    setEditingSponsor(null)
    reset({
      name: '',
      amount_cents: '',
      benefits_json: '',
      is_active: true,
    })
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sponsor Tiers</h1>
        <button onClick={handleNew} className="btn-primary">
          Create Tier
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
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{sponsor.name}</td>
                    <td className="py-3 px-4 text-right">
                      ${(sponsor.amount_cents / 100).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sponsor.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sponsor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
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
              {editingSponsor ? 'Edit Sponsor Tier' : 'Create Sponsor Tier'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="Tier Name"
                {...register('name')}
                error={errors.name?.message}
                required
              />
              <FormField
                label="Amount (in dollars)"
                type="number"
                step="0.01"
                {...register('amount_cents')}
                error={errors.amount_cents?.message}
                required
              />
              <div>
                <label className="label">
                  Benefits (JSON format)
                  <span className="text-xs text-gray-500 ml-2">
                    e.g., {`{"benefit1": "Logo on website", "benefit2": "Event mention"}`}
                  </span>
                </label>
                <textarea
                  className="input min-h-[120px] font-mono text-sm"
                  {...register('benefits_json')}
                />
                {errors.benefits_json && (
                  <p className="mt-1 text-sm text-red-500">{errors.benefits_json.message}</p>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                  {...register('is_active')}
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium">
                  Active tier
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
                  {editingSponsor ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

