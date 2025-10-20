import Hero from '@/components/common/Hero'

export default function DonationTerms() {
  return (
    <div>
      <Hero title="Donation Terms" height="small" />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl prose prose-lg">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2>Tax-Exempt Status</h2>
          <p>
            The Dorothy R. Morgan Foundation has applied for 501(c)(3) tax-exempt status with the
            IRS. Once approved, donations may be tax-deductible to the extent allowed by law. We
            will provide updated information and tax receipts once our status is confirmed.
          </p>

          <h2>Donation Processing</h2>
          <p>
            All online donations are processed securely through Stripe, a PCI-compliant payment
            processor. We do not store your complete credit card information on our servers.
          </p>

          <h2>Recurring Donations</h2>
          <p>
            If you choose to make a recurring monthly donation, your payment method will be charged
            automatically each month until you cancel. You may cancel at any time by contacting us
            at <a href="mailto:info@tdrmf.org">info@tdrmf.org</a>.
          </p>

          <h2>Use of Funds</h2>
          <p>
            Your donations support our mission to honor Dorothy R. Morgan's memory through family
            support, healing programs, and youth initiatives. We are committed to using donations
            efficiently and transparently.
          </p>

          <h2>Refund Policy</h2>
          <p>
            All donations are final. However, if you believe a donation was made in error, please
            contact us within 30 days at <a href="mailto:info@tdrmf.org">info@tdrmf.org</a>.
          </p>

          <h2>Dedication and Memorial Gifts</h2>
          <p>
            You may include a dedication or memorial note with your donation. We will acknowledge
            your gift according to your preferences.
          </p>

          <h2>Privacy</h2>
          <p>
            We respect your privacy and will not share your personal information with third parties
            except as necessary to process your donation. See our{' '}
            <a href="/privacy">Privacy Policy</a> for more information.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about donations or need assistance, please contact us at{' '}
            <a href="mailto:info@tdrmf.org">info@tdrmf.org</a> or call (555) 123-4567.
          </p>
        </div>
      </section>
    </div>
  )
}

