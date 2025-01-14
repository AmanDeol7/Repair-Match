'use client'

import { useEffect, useState } from 'react'
import { JobCard } from './job-card'
import { JobFilters, type JobFilters as Filters } from './job-filters'
import { JobWithProfile } from '@/lib/types/job'
import { supabase } from '@/lib/supabase/client'

export function JobList() {
  const [jobs, setJobs] = useState<JobWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async (filters: Filters) => {
    try {
      let query = supabase
        .from('repair_jobs')
        .select(`
          *,
          profiles:requester_id (
            full_name,
            avatar_url,
            rating
          )
        `)
        .order('created_at', { ascending: false })

      if (filters.category !== 'All') {
        query = query.eq('category', filters.category)
      }

      if (filters.status !== 'All') {
        query = query.eq('status', filters.status.toLowerCase())
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setJobs(data as JobWithProfile[])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: Filters) => {
    fetchJobs(filters)
  }

  useEffect(() => {
    fetchJobs({
      search: '',
      category: 'All',
      status: 'All',
      sortBy: 'Newest',
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <JobFilters onFilterChange={handleFilterChange} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}