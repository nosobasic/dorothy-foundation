import { Link } from 'react-router-dom'
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/content'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-navy text-white mt-auto">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              The Dorothy R. Morgan Foundation
            </h3>
            <p className="text-gray-300 text-sm">
              From Loss to Light. Supporting families, healing, and youth programs in honor of
              Dorothy R. Morgan.
            </p>
            <p className="text-gray-400 text-xs mt-4">
              501(c)(3) Application Pending
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <address className="text-gray-300 text-sm not-italic space-y-2">
              <p>{CONTACT_INFO.phone}</p>
              <p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-muted-gold">
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>{CONTACT_INFO.address}</p>
            </address>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link to="/about" className="block text-gray-300 hover:text-muted-gold text-sm">
                About
              </Link>
              <Link to="/events" className="block text-gray-300 hover:text-muted-gold text-sm">
                Events
              </Link>
              <Link to="/donate" className="block text-gray-300 hover:text-muted-gold text-sm">
                Donate
              </Link>
              <Link to="/volunteer" className="block text-gray-300 hover:text-muted-gold text-sm">
                Volunteer
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-muted-gold text-sm">
                Contact
              </Link>
            </nav>
            <div className="flex space-x-4 mt-4">
              <a
                href={SOCIAL_LINKS.facebook}
                className="text-gray-300 hover:text-muted-gold"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                FB
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                className="text-gray-300 hover:text-muted-gold"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} The Dorothy R. Morgan Foundation. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-muted-gold">
              Privacy Policy
            </Link>
            <Link to="/donation-terms" className="hover:text-muted-gold">
              Donation Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

