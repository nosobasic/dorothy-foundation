import { Link, Outlet } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'

export default function AdminLayout() {
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/' })
  }

  if (!isLoaded || !user) {
    return null
  }

  const displayEmail =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? ''

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-deep-navy text-white">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">TDRMF Admin Dashboard</h1>
              {displayEmail && <p className="text-sm text-gray-300">{displayEmail}</p>}
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm hover:text-brand-purple" target="_blank" rel="noopener noreferrer">
                View Website →
              </a>
              <button onClick={handleLogout} className="btn-outline border-white text-white hover:bg-white hover:text-deep-navy text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="card space-y-1" aria-label="Admin navigation">
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/events"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Events
              </Link>
              <Link
                to="/admin/gallery"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/admin/donations"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Donations
              </Link>
              <Link
                to="/admin/sponsors"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Sponsors
              </Link>
            </nav>
          </aside>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
