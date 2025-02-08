'use client'

import { useState, useEffect } from 'react'
import { JobList } from '@/components/jobs/job-list'
import { JobMap } from '@/components/map/job-map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import type { JobWithProfile } from '@/lib/types/job'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('repair_jobs')
          .select(`
            *,
            profiles:requester_id (
              full_name,
              avatar_url,
              rating
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })

        if (error) throw error
        const formattedData = data.map((job: any) => ({
          ...job,
          profiles: job.profiles.error ? null : job.profiles
        }));
        setJobs(formattedData || [])
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Available Repair Jobs</h1>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <JobList />
        </TabsContent>

        <TabsContent value="map">
          <JobMap jobs={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}