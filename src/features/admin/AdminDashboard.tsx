import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { DonationStats } from '@/lib/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DonationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/donations/stats')
      .then((res) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading stats:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Total Donations
          </h3>
          {loading ? (
            <p className="text-2xl font-bold">Loading...</p>
          ) : (
            <p className="text-3xl font-bold text-brand-purple">
              ${stats ? (stats.total_amount_cents / 100).toLocaleString() : '0'}
            </p>
          )}
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Total Donors
          </h3>
          {loading ? (
            <p className="text-2xl font-bold">Loading...</p>
          ) : (
            <p className="text-3xl font-bold text-deep-navy">
              {stats ? stats.total_count : 0}
            </p>
          )}
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Recurring Donors
          </h3>
          {loading ? (
            <p className="text-2xl font-bold">Loading...</p>
          ) : (
            <p className="text-3xl font-bold text-deep-navy">
              {stats ? stats.recurring_count : 0}
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/admin/events" className="block p-4 border-2 border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
            <h3 className="font-semibold mb-2">Manage Events</h3>
            <p className="text-sm text-gray-600">Create, edit, and publish events</p>
          </a>
          <a href="/admin/gallery" className="block p-4 border-2 border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
            <h3 className="font-semibold mb-2">Moderate Gallery</h3>
            <p className="text-sm text-gray-600">Approve or reject photo submissions</p>
          </a>
          <a href="/admin/donations" className="block p-4 border-2 border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
            <h3 className="font-semibold mb-2">View Donations</h3>
            <p className="text-sm text-gray-600">See all donation records</p>
          </a>
          <a href="/admin/sponsors" className="block p-4 border-2 border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
            <h3 className="font-semibold mb-2">Manage Sponsors</h3>
            <p className="text-sm text-gray-600">Edit sponsor tiers and benefits</p>
          </a>
        </div>
      </div>
    </div>
  )
}

