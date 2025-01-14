'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}