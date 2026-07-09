import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { clearTokenGetter, setTokenGetter } from '@/lib/authToken'

export default function ClerkAuthBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    setTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) {
        return null
      }
      return getToken()
    })

    return () => {
      clearTokenGetter()
    }
  }, [getToken, isLoaded, isSignedIn])

  return null
}
