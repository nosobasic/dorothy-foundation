import { ReactNode } from 'react'
import { ClerkFailed, ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import ClerkAuthBridge from '@/components/auth/ClerkAuthBridge'

interface ClerkAdminShellProps {
  children: ReactNode
}

function AdminAuthNotConfigured() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Auth Not Configured</h1>
        <p className="text-gray-600 mb-6">
          Set <code className="text-sm">VITE_CLERK_PUBLISHABLE_KEY</code> in your frontend
          environment to enable admin access.
        </p>
        <a href="/" className="btn-primary">
          Return to Home
        </a>
      </div>
    </div>
  )
}

function ClerkLoadFailed() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="card max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Sign-In Unavailable</h1>
        <p className="text-gray-600 mb-4">
          Clerk failed to load. This often happens when a custom Clerk domain (for example{' '}
          <code className="text-sm">clerk.yourdomain.com</code>) is not fully configured.
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          In the Clerk Dashboard, complete your custom domain DNS setup or disable the custom
          Frontend API domain and redeploy.
        </p>
        <a href="/" className="btn-primary">
          Return to Home
        </a>
      </div>
    </div>
  )
}

export default function ClerkAdminShell({ children }: ClerkAdminShellProps) {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!clerkPublishableKey) {
    return <AdminAuthNotConfigured />
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ClerkAuthBridge />
      <ClerkFailed>
        <ClerkLoadFailed />
      </ClerkFailed>
      <ClerkLoading>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">Loading admin...</p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  )
}
