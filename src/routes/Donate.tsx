import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Hero from '@/components/common/Hero'
import { FormField, TextAreaField } from '@/components/forms/FormField'
import { DONATION_501C3_NOTICE, MAILING_INSTRUCTIONS } from '@/lib/content'
import api from '@/lib/api'
import { useToastStore } from '@/lib/store'

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '')

const donationSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 1
  }, 'Amount must be at least $1'),
  donor_name: z.string().optional(),
  donor_email: z.string().email('Invalid email').optional().or(z.literal('')),
  dedication_note: z.string().optional(),
  is_recurring: z.boolean(),
})

type DonationForm = z.infer<typeof donationSchema>

const PRESET_AMOUNTS = [25, 50, 100, 250, 500]

function CheckoutForm({ clientSecret: _clientSecret, amount }: { clientSecret: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const { showToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate?success=true&amount=${amount}`,
      },
    })

    if (error) {
      showToast(error.message || 'Payment failed', 'error')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="btn-primary w-full">
        {processing ? 'Processing...' : `Donate $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [showMailInstructions, setShowMailInstructions] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      is_recurring: false,
    },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (data: DonationForm) => {
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount < 1) {
      showToast('Please enter a valid amount', 'error')
      return
    }

    setProcessing(true)
    try {
      const response = await api.post('/api/donations/checkout', {
        amount_cents: Math.round(amount * 100),
        donor_name: data.donor_name,
        donor_email: data.donor_email,
        is_recurring: data.is_recurring,
        dedication_note: data.dedication_note,
      })

      setClientSecret(response.data.client_secret)
    } catch (error) {
      showToast('Failed to initiate payment. Please try again.', 'error')
      setProcessing(false)
    }
  }

  const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0)

  // Check for success in URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    return (
      <div>
        <Hero title="Thank You!" subtitle="Your donation has been received" height="medium" />
        <section className="py-16 bg-white">
          <div className="container-custom max-w-2xl text-center">
            <div className="card">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-green-500"
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
              <h2 className="text-2xl font-bold mb-4">Your Donation Was Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your generous donation of ${urlParams.get('amount')}. Your support
                helps us continue Dorothy's legacy of compassion and service.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                A receipt has been sent to your email address.
              </p>
              <a href="/" className="btn-primary">
                Return to Home
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <Hero title="Donate" subtitle="Support our mission to transform loss into light" height="medium" />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="card mb-8 bg-blue-50 border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">{DONATION_501C3_NOTICE}</p>
          </div>

          {!clientSecret ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Amount Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Amount</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`py-2 sm:py-3 px-2 sm:px-4 rounded-md border-2 font-semibold transition-colors text-sm sm:text-base ${
                        selectedAmount === amount
                          ? 'border-brand-purple bg-brand-purple text-white'
                          : 'border-gray-300 hover:border-brand-purple'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="label">Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      className="input pl-8"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(null)
                      }}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              {/* Recurring */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_recurring"
                  className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                  {...register('is_recurring')}
                />
                <label htmlFor="is_recurring" className="ml-2 text-sm font-medium">
                  Make this a monthly recurring donation
                </label>
              </div>

              {/* Donor Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Information (Optional)</h3>
                <FormField
                  label="Name"
                  type="text"
                  {...register('donor_name')}
                  error={errors.donor_name?.message}
                />
                <FormField
                  label="Email"
                  type="email"
                  {...register('donor_email')}
                  error={errors.donor_email?.message}
                />
                <TextAreaField
                  label="Dedication (Optional)"
                  placeholder="In memory of..."
                  {...register('dedication_note')}
                  error={errors.dedication_note?.message}
                />
              </div>

              <button type="submit" disabled={processing || !finalAmount} className="btn-primary w-full">
                {processing ? 'Processing...' : `Proceed to Payment - $${finalAmount.toFixed(2)}${isRecurring ? '/month' : ''}`}
              </button>
            </form>
          ) : (
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Complete Your Donation</h3>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} amount={finalAmount} />
              </Elements>
            </div>
          )}

          {/* Mail-in Donations */}
          <div className="mt-12">
            <button
              onClick={() => setShowMailInstructions(!showMailInstructions)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold">Mail-In Donation Instructions</span>
              <svg
                className={`w-5 h-5 transition-transform ${showMailInstructions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showMailInstructions && (
              <div className="mt-4 p-6 bg-gray-50 rounded-lg prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: MAILING_INSTRUCTIONS.replace(/\n/g, '<br />') }} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

