'use client'

import { useState, useEffect } from 'react'
import { RepairersMap } from '@/components/map/repairer-map'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/profile'
import BackButton from '@/components/back-button'
export default function RepairersPage() {
  const [repairers, setRepairers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepairers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'repairer')
          .not('address', 'is', null)

        if (error) throw error
        setRepairers(data as unknown as  [])
      } catch (error) {
        console.error('Error fetching repairers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepairers()
  }, [])
  console.log(repairers);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="px-4 py-8">
      <div className='mb-4'>
      <BackButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Find Repairers Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <RepairersMap repairers={repairers} />
        </CardContent>
      </Card>
    </div>
  )
}