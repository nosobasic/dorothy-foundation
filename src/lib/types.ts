export interface Event {
  id: number
  title: string
  summary?: string
  description?: string
  start_at: string
  end_at?: string
  location?: string
  external_registration_url?: string
  is_published: boolean
  created_at: string
}

export interface Donation {
  id: number
  amount_cents: number
  currency: string
  donor_email?: string
  donor_name?: string
  status: string
  is_recurring: boolean
  dedication_note?: string
  created_at: string
}

export interface GalleryPhoto {
  id: number
  title: string
  description?: string
  uploader_name: string
  uploader_email: string
  s3_key: string
  url: string
  approved: boolean
  submitted_at: string
}

export interface SponsorTier {
  id: number
  name: string
  amount_cents: number
  benefits_json?: Record<string, any>
  is_active: boolean
  created_at: string
}

export interface DonationStats {
  total_amount_cents: number
  total_count: number
  recurring_count: number
}

