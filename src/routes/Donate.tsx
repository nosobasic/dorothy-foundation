import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import Hero from '@/components/common/Hero'
import { FormField, TextAreaField } from '@/components/forms/FormField'
import { DONATION_501C3_NOTICE, MAILING_INSTRUCTIONS } from '@/lib/content'
import api from '@/lib/api'
import { useToastStore } from '@/lib/store'

const stripeKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const donationSchema = z
  .object({
    donor_name: z.string().optional(),
    donor_email: z.string().email('Invalid email').optional().or(z.literal('')),
    dedication_note: z.string().optional(),
    is_recurring: z.boolean(),
  })
  .refine((data) => !data.is_recurring || Boolean(data.donor_email), {
    message: 'Email is required for recurring donations',
    path: ['donor_email'],
  })

type DonationForm = z.infer<typeof donationSchema>

interface VerifiedDonation {
  amount_cents: number
  is_recurring: boolean
  donor_email: string | null
  status: string
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500]
const MIN_AMOUNT = 1

function parseAmount(selectedAmount: number | null, customAmount: string): number | null {
  if (selectedAmount !== null) {
    return selectedAmount
  }
  if (!customAmount.trim()) {
    return null
  }
  const parsed = parseFloat(customAmount)
  if (isNaN(parsed)) {
    return null
  }
  return parsed
}

function CheckoutForm({
  amount,
  isRecurring,
}: {
  amount: number
  isRecurring: boolean
}) {
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
        return_url: `${window.location.origin}/donate`,
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
        {processing
          ? 'Processing...'
          : `Donate $${amount.toFixed(2)}${isRecurring ? '/month' : ''}`}
      </button>
      <p className="text-xs text-gray-500 text-center">
        By donating, you agree to our{' '}
        <Link to="/donation-terms" className="text-brand-purple hover:underline">
          Donation Terms
        </Link>
        .
      </p>
    </form>
  )
}

function DonationSuccessView() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [donation, setDonation] = useState<VerifiedDonation | null>(null)

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    const paymentIntent = searchParams.get('payment_intent')

    if (redirectStatus !== 'succeeded' || !paymentIntent) {
      setStatus('failed')
      return
    }

    api
      .get<VerifiedDonation>(`/api/donations/verify?payment_intent=${paymentIntent}`)
      .then((response) => {
        setDonation(response.data)
        setStatus('success')
      })
      .catch(() => setStatus('failed'))
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div>
        <Hero title="Processing..." subtitle="Confirming your donation" height="medium" />
        <section className="py-16 bg-white">
          <div className="container-custom max-w-2xl text-center">
            <p className="text-gray-600">Please wait while we verify your payment.</p>
          </div>
        </section>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div>
        <Hero title="Payment Not Confirmed" subtitle="We could not verify your donation" height="medium" />
        <section className="py-16 bg-white">
          <div className="container-custom max-w-2xl text-center">
            <div className="card">
              <p className="text-gray-600 mb-6">
                Your payment may not have completed, or we were unable to verify it. If you believe
                this is an error, please contact us at{' '}
                <a href="mailto:info@tdrmf.org" className="text-brand-purple hover:underline">
                  info@tdrmf.org
                </a>
                .
              </p>
              <Link to="/donate" className="btn-primary">
                Try Again
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const amount = (donation!.amount_cents / 100).toFixed(2)

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
              aria-hidden="true"
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
              Thank you for your generous {donation!.is_recurring ? 'monthly ' : ''}donation of $
              {amount}. Your support helps us continue Dorothy&apos;s legacy of compassion and service.
            </p>
            {donation!.donor_email ? (
              <p className="text-sm text-gray-500 mb-6">
                A receipt has been sent to {donation!.donor_email}.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                Contact us at{' '}
                <a href="mailto:info@tdrmf.org" className="text-brand-purple hover:underline">
                  info@tdrmf.org
                </a>{' '}
                if you need a receipt.
              </p>
            )}
            <Link to="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Donate() {
  const [searchParams] = useSearchParams()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [checkoutRecurring, setCheckoutRecurring] = useState(false)
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
  const finalAmount = parseAmount(selectedAmount, customAmount)
  const isValidAmount = finalAmount !== null && finalAmount >= MIN_AMOUNT

  const validateAmount = (): number | null => {
    const amount = parseAmount(selectedAmount, customAmount)
    if (amount === null) {
      setAmountError('Please select or enter an amount')
      return null
    }
    if (amount < MIN_AMOUNT) {
      setAmountError('Amount must be at least $1')
      return null
    }
    setAmountError('')
    return amount
  }

  const onSubmit = async (data: DonationForm) => {
    const amount = validateAmount()
    if (amount === null) {
      return
    }

    if (!stripePromise) {
      showToast('Payment system is not configured. Please try again later.', 'error')
      return
    }

    setProcessing(true)
    try {
      const response = await api.post('/api/donations/checkout', {
        amount_cents: Math.round(amount * 100),
        donor_name: data.donor_name || undefined,
        donor_email: data.donor_email || undefined,
        is_recurring: data.is_recurring,
        dedication_note: data.dedication_note || undefined,
      })

      setCheckoutRecurring(data.is_recurring)
      setClientSecret(response.data.client_secret)
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.detail || 'Failed to initiate payment. Please try again.'
        : 'Failed to initiate payment. Please try again.'
      showToast(typeof message === 'string' ? message : 'Failed to initiate payment.', 'error')
    } finally {
      setProcessing(false)
    }
  }

  if (searchParams.get('redirect_status') || searchParams.get('payment_intent')) {
    return <DonationSuccessView />
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
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Amount</h3>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-4"
                  role="group"
                  aria-label="Donation amount"
                >
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={selectedAmount === amount}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                        setAmountError('')
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
                  <label htmlFor="custom-amount" className="label">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      className="input pl-8"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(null)
                        setAmountError('')
                      }}
                    />
                  </div>
                  {amountError && (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {amountError}
                    </p>
                  )}
                </div>
              </div>

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

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Information (Optional)</h3>
                <FormField
                  label="Name"
                  type="text"
                  {...register('donor_name')}
                  error={errors.donor_name?.message}
                />
                <FormField
                  label={isRecurring ? 'Email (Required for recurring donations)' : 'Email'}
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

              <button
                type="submit"
                disabled={processing || !isValidAmount}
                className="btn-primary w-full"
              >
                {processing
                  ? 'Processing...'
                  : isValidAmount
                    ? `Proceed to Payment - $${finalAmount.toFixed(2)}${isRecurring ? '/month' : ''}`
                    : 'Select an amount to continue'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By donating, you agree to our{' '}
                <Link to="/donation-terms" className="text-brand-purple hover:underline">
                  Donation Terms
                </Link>
                .
              </p>
            </form>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Complete Your Donation</h3>
                <button
                  type="button"
                  onClick={() => setClientSecret('')}
                  className="text-sm text-brand-purple hover:underline"
                >
                  &larr; Edit details
                </button>
              </div>
              {stripePromise && finalAmount !== null ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm amount={finalAmount} isRecurring={checkoutRecurring} />
                </Elements>
              ) : (
                <p className="text-red-500 text-sm" role="alert">
                  Payment system is not configured. Please contact support.
                </p>
              )}
            </div>
          )}

          <div className="mt-12">
            <button
              type="button"
              onClick={() => setShowMailInstructions(!showMailInstructions)}
              aria-expanded={showMailInstructions}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold">Mail-In Donation Instructions</span>
              <svg
                className={`w-5 h-5 transition-transform ${showMailInstructions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                <p className="font-semibold">{MAILING_INSTRUCTIONS.title}</p>
                <p className="mt-2">
                  Please make checks payable to &ldquo;{MAILING_INSTRUCTIONS.payableTo}&rdquo; and mail
                  to:
                </p>
                <address className="mt-2 not-italic">
                  {MAILING_INSTRUCTIONS.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-4">
                  <strong>Important:</strong> {MAILING_INSTRUCTIONS.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
