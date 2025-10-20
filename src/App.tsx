import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/common/Toaster'
import Layout from '@/components/common/Layout'

// Pages
import Home from '@/routes/Home'
import About from '@/routes/About'
import Events from '@/routes/Events'
import EventDetail from '@/routes/EventDetail'
import Donate from '@/routes/Donate'
import Volunteer from '@/routes/Volunteer'
import Gallery from '@/routes/Gallery'
import GallerySubmit from '@/routes/GallerySubmit'
import Sponsors from '@/routes/Sponsors'
import Contact from '@/routes/Contact'
import Privacy from '@/routes/Privacy'
import DonationTerms from '@/routes/DonationTerms'

// Admin
import AdminLayout from '@/features/admin/AdminLayout'
import AdminDashboard from '@/features/admin/AdminDashboard'
import AdminEvents from '@/features/admin/AdminEvents'
import AdminGallery from '@/features/admin/AdminGallery'
import AdminDonations from '@/features/admin/AdminDonations'
import AdminSponsors from '@/features/admin/AdminSponsors'
import AdminLogin from '@/features/admin/AdminLogin'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="donate" element={<Donate />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/submit" element={<GallerySubmit />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="donation-terms" element={<DonationTerms />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="sponsors" element={<AdminSponsors />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App

