export interface Bid {
  id: string
  created_at: string
  job_id: string
  repairer_id: string
  amount: number
  description: string
  estimated_days: number
  status: 'pending' | 'accepted' | 'rejected'
  profiles: {
    full_name: string
    avatar_url: string
    rating: number
  }
}