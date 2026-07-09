import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setTokenGetter } from '@/lib/authToken'

export default function ClerkAuthBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    setTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) {
        return null
      }
      return getToken()
    })
  }, [getToken, isLoaded, isSignedIn])

  return null
}
