import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import api from '@/lib/api'
import { GalleryPhoto } from '@/lib/types'
import { useToastStore } from '@/lib/store'

export default function AdminGallery() {
  const [pendingPhotos, setPendingPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { showToast } = useToastStore()

  const loadPhotos = () => {
    api
      .get('/api/gallery/admin/pending')
      .then((res) => {
        setPendingPhotos(res.data)
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/api/gallery/admin/${id}/approve`, { approved: true })
      showToast('Photo approved successfully', 'success')
      loadPhotos()
      setDialogOpen(false)
    } catch (error) {
      showToast('Failed to approve photo', 'error')
    }
  }

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject and delete this photo?')) return
    try {
      await api.delete(`/api/gallery/admin/${id}`)
      showToast('Photo rejected and deleted', 'success')
      loadPhotos()
      setDialogOpen(false)
    } catch (error) {
      showToast('Failed to delete photo', 'error')
    }
  }

  const handleView = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo)
    setDialogOpen(true)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gallery Moderation</h1>

      {loading ? (
        <p>Loading...</p>
      ) : pendingPhotos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPhotos.map((photo) => (
            <div key={photo.id} className="card">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-2">{photo.title}</h3>
              {photo.description && (
                <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
              )}
              <div className="text-sm text-gray-500 mb-4">
                <p>By: {photo.uploader_name}</p>
                <p>{photo.uploader_email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(photo)}
                  className="flex-1 btn-outline text-sm py-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleApprove(photo.id)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(photo.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No pending photos to review</p>
        </div>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedPhoto && (
              <>
                <Dialog.Title className="text-2xl font-bold mb-4">
                  {selectedPhoto.title}
                </Dialog.Title>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full rounded-lg mb-4"
                />
                {selectedPhoto.description && (
                  <p className="text-gray-700 mb-4">{selectedPhoto.description}</p>
                )}
                <div className="text-sm text-gray-600 mb-6">
                  <p>
                    <strong>Submitted by:</strong> {selectedPhoto.uploader_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPhoto.uploader_email}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(selectedPhoto.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setDialogOpen(false)} className="btn-outline">
                    Close
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPhoto.id)}
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedPhoto.id)}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
                  >
                    Reject & Delete
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

