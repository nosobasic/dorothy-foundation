import Hero from '@/components/common/Hero'

export default function Privacy() {
  return (
    <div>
      <Hero title="Privacy Policy" height="small" />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl prose prose-lg">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            The Dorothy R. Morgan Foundation ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website or make a donation.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, and mailing
              address when you donate, volunteer, or contact us
            </li>
            <li>
              <strong>Payment Information:</strong> Credit card and billing information when making
              donations (processed securely through Stripe)
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact with our website
            </li>
            <li>
              <strong>Cookies:</strong> Small data files stored on your device to enhance your
              experience
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process donations and provide tax receipts</li>
            <li>Communicate about our programs, events, and impact</li>
            <li>Respond to your inquiries and requests</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information with:
          </p>
          <ul>
            <li>Service providers who help us operate our website and process donations</li>
            <li>Law enforcement or government agencies when required by law</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However,
            no method of transmission over the internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Request deletion of your personal information</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:info@tdrmf.org">info@tdrmf.org</a>.
          </p>
        </div>
      </section>
    </div>
  )
}

