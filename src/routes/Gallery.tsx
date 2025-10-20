import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Hero from '@/components/common/Hero'
import api from '@/lib/api'
import { GalleryPhoto } from '@/lib/types'

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    api
      .get('/api/gallery')
      .then((res) => {
        setPhotos(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading gallery:', error)
        setLoading(false)
      })
  }, [])

  const slides = photos.map((photo) => ({
    src: photo.url,
    title: photo.title,
    description: photo.description,
  }))

  return (
    <div>
      <Hero
        title="Photo Gallery"
        subtitle="Celebrating our community and honoring Dorothy's legacy"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <Link to="/gallery/submit" className="btn-primary">
              Submit a Photo
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading photos...</p>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => {
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-muted-gold"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-gray-200 text-sm line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No photos in the gallery yet.</p>
              <Link to="/gallery/submit" className="text-muted-gold hover:underline">
                Be the first to submit a photo!
              </Link>
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />
    </div>
  )
}

