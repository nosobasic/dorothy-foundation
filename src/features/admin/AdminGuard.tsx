import { ReactNode } from 'react'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { useAuthStore } from '@/lib/store'

interface AdminGuardProps {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated()) {
    return <>{children}</>
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/admin" />
      </SignedOut>
    </>
  )
}



