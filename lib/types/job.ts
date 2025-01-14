export interface Job {
  id: string
  title: string
  description: string
  budget: number
  category: string
  location: string
  status: 'open' | 'in_progress' | 'completed'
  created_at: string
  requester_id: string
  repairer_id: string | null
}

export interface JobWithProfile extends Job {
  profiles: {
    full_name: string
    avatar_url: string
    rating: number
  }
}