'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { JobCard } from '@/components/jobs/job-card'
import { supabase } from '@/lib/supabase/client'
import type { JobWithProfile } from '@/lib/types/job'
import type { Bid } from '@/lib/types/bid'
import BackButton from '@/components/back-button'
export default function MyJobsPage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const [postedJobs, setPostedJobs] = useState<JobWithProfile[]>([])
  const [bidJobs, setBidJobs] = useState<JobWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return

      try {
        // Fetch jobs posted by the user
        const { data: postedData } = await supabase
          .from('repair_jobs')
          .select(`
            *,
            profiles:requester_id (
              full_name,
              avatar_url,
              rating
            )
          `)
          .eq('requester_id', user.id)
          .order('created_at', { ascending: false })

        setPostedJobs(postedData as unknown as JobWithProfile[])

        // Fetch jobs where user has placed bids
        const { data: bidsData } = await supabase
          .from('bids')
          .select('job_id')
          .eq('repairer_id', user.id)

        if (bidsData && bidsData.length > 0) {
          const jobIds = bidsData.map(bid => bid.job_id)
          const { data: bidJobsData } = await supabase
            .from('repair_jobs')
            .select(`
              *,
              profiles:requester_id (
                full_name,
                avatar_url,
                rating
              )
            `)
            .in('id', jobIds)  
            .order('created_at', { ascending: false })

          setBidJobs(bidJobsData as unknown as JobWithProfile[])
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [user])

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
          <CardTitle className="text-2xl">My Jobs</CardTitle> 
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posted" className="space-y-4">
            <TabsList>
              {profile?.role ==='requester' &&<TabsTrigger value="posted">
                Posted Jobs ({postedJobs.length})
              </TabsTrigger>}
              
              {profile?.role === 'repairer' && (
                <TabsTrigger value="bids">
                  Jobs I've Bid On ({bidJobs.length})
                </TabsTrigger>
              )}
            </TabsList>
            {profile?.role === 'requester'&& <TabsContent value="posted">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {postedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                {postedJobs.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground">
                    You haven't posted any jobs yet.
                  </div>
                )}
              </div>
            </TabsContent> }
            

            {profile?.role === 'repairer' && (
              <TabsContent value="bids">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bidJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                  {bidJobs.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                      You haven't bid on any jobs yet.
                    </div>
                  )}      
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}