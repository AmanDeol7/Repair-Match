export interface Notification {
    id: string
    created_at: string | null
    user_id: string
    type: 'new_bid' | 'bid_accepted' | 'job_completed' | 'message'
    title: string
    message: string
    read: boolean | null
    data?: Record<string, any> | string | null | number| boolean;
  }
