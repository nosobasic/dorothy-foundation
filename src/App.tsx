import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/common/Toaster'
import Layout from '@/components/common/Layout'
import ScrollToTop from '@/components/common/ScrollToTop'

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
import NotFound from '@/routes/NotFound'

const AdminRoutes = lazy(() => import('@/features/admin/AdminRoutes'))

function App() {
  return (
    <>
      <ScrollToTop />
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

        {/* Admin routes — lazy loaded so Clerk is not bundled on public pages */}
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-600">Loading...</p>
                </div>
              }
            >
              <AdminRoutes />
            </Suspense>
          }
        />

        {/* 404 Catch-all - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
