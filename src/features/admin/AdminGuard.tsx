import { ReactNode } from 'react'
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { isClerkAdmin } from '@/lib/clerkAdmin'

interface AdminGuardProps {
  children: ReactNode
}

function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access the admin panel. Contact an administrator if you
          believe this is an error.
        </p>
        <a href="/" className="btn-primary">
          Return to Home
        </a>
      </div>
    </div>
  )
}

function AdminContent({ children }: AdminGuardProps) {
  const { isLoaded, user } = useUser()

  if (!isLoaded) {
    return null
  }

  if (!isClerkAdmin(user)) {
    return <AccessDenied />
  }

  return <>{children}</>
}

export default function AdminGuard({ children }: AdminGuardProps) {
  return (
    <>
      <SignedIn>
        <AdminContent>{children}</AdminContent>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/admin" />
      </SignedOut>
    </>
  )
}
