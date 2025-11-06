import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/forms/FormField'
import api from '@/lib/api'
import { useAuthStore, useToastStore } from '@/lib/store'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { showToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setSubmitting(true)
    try {
      const response = await api.post('/api/auth/login', data)
      const { access_token } = response.data
      
      // Get user info
      const userResponse = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      
      setAuth(userResponse.data, access_token)
      showToast('Login successful!', 'success')
      navigate('/admin')
    } catch (error) {
      showToast('Invalid email or password', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h1 className="text-center text-3xl font-bold text-deep-navy mb-2">Admin Login</h1>
          <p className="text-center text-gray-600 mb-8">
            The Dorothy R. Morgan Foundation
          </p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />
            <FormField
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              required
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-gray-600 hover:text-brand-purple">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}

