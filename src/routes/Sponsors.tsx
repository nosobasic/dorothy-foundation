import { useEffect, useState } from 'react'
import Hero from '@/components/common/Hero'
import api from '@/lib/api'
import { SponsorTier } from '@/lib/types'

export default function Sponsors() {
  const [tiers, setTiers] = useState<SponsorTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/sponsors')
      .then((res) => {
        setTiers(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading sponsor tiers:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <Hero
        title="Sponsor an Event"
        subtitle="Partner with us to make a lasting impact"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Event sponsorships help us fund our programs, events, and community initiatives. Your
              support enables us to continue Dorothy's legacy of compassion and service.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading sponsor tiers...</p>
          ) : tiers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div key={tier.id} className="card border-2 border-gray-200 hover:border-brand-purple transition-colors">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold text-brand-purple mb-6">
                    ${(tier.amount_cents / 100).toLocaleString()}
                  </p>
                  {tier.benefits_json && (
                    <div>
                      <h4 className="font-semibold mb-3">Benefits Include:</h4>
                      <ul className="space-y-2 text-gray-600">
                        {Object.entries(tier.benefits_json).map(([key, value]) => (
                          <li key={key} className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{String(value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No sponsor tiers available at this time.</p>
          )}

          <div className="mt-12 card bg-gray-50 text-center">
            <h3 className="text-xl font-semibold mb-4">Interested in Sponsoring?</h3>
            <p className="text-gray-600 mb-6">
              Contact us to discuss sponsorship opportunities and how we can work together.
            </p>
            <a href="/contact" className="btn-primary">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

