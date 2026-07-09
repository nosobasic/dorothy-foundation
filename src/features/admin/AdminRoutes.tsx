import { Route, Routes } from 'react-router-dom'
import ClerkAdminShell from '@/components/auth/ClerkAdminShell'
import AdminGuard from '@/features/admin/AdminGuard'
import AdminLayout from '@/features/admin/AdminLayout'
import AdminDashboard from '@/features/admin/AdminDashboard'
import AdminEvents from '@/features/admin/AdminEvents'
import AdminGallery from '@/features/admin/AdminGallery'
import AdminDonations from '@/features/admin/AdminDonations'
import AdminSponsors from '@/features/admin/AdminSponsors'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ClerkAdminShell>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </ClerkAdminShell>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="donations" element={<AdminDonations />} />
        <Route path="sponsors" element={<AdminSponsors />} />
      </Route>
    </Routes>
  )
}
