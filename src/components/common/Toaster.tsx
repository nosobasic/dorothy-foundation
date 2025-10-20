import { useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'
import { useToastStore } from '@/lib/store'

export function Toaster() {
  const { show, message, type, hideToast } = useToastStore()

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideToast()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, hideToast])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={show}
        onOpenChange={hideToast}
        className={`${bgColor} text-white rounded-lg shadow-lg p-4 max-w-md`}
      >
        <Toast.Description className="text-sm">{message}</Toast.Description>
        <Toast.Close className="ml-4" aria-label="Close">
          ×
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-full m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  )
}

