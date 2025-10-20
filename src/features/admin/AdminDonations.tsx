import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import api from '@/lib/api'
import { Donation } from '@/lib/types'

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/donations/list')
      .then((res) => {
        setDonations(res.data)
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  const exportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Amount',
      'Donor Name',
      'Donor Email',
      'Type',
      'Status',
      'Dedication',
    ]
    const rows = donations.map((d) => [
      d.id,
      format(new Date(d.created_at), 'yyyy-MM-dd HH:mm'),
      (d.amount_cents / 100).toFixed(2),
      d.donor_name || '',
      d.donor_email || '',
      d.is_recurring ? 'Recurring' : 'One-time',
      d.status,
      d.dedication_note || '',
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Donations</h1>
        <button onClick={exportCSV} className="btn-secondary">
          Export CSV
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
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Donor</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {format(new Date(donation.created_at), 'PP')}
                    </td>
                    <td className="py-3 px-4">{donation.donor_name || 'Anonymous'}</td>
                    <td className="py-3 px-4">{donation.donor_email || '-'}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${(donation.amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {donation.is_recurring ? (
                        <span className="text-blue-600">Recurring</span>
                      ) : (
                        'One-time'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          donation.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {donations.length === 0 && (
            <p className="text-center py-8 text-gray-600">No donations yet</p>
          )}
        </div>
      )}
    </div>
  )
}

