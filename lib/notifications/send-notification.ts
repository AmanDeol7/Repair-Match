import { supabase } from '@/lib/supabase/client'

export async function sendNotification(
  userId: string,
  type: 'new_bid' | 'bid_accepted' | 'job_completed' | 'message',
  title: string,
  message: string,
  data?: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}
