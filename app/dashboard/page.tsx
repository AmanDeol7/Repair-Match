'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistance } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/jobs/job-card'
import { supabase } from '@/lib/supabase/client'
import type { JobWithProfile } from '@/lib/types/job'
import type { Bid } from '@/lib/types/bid'
import BackButton from '@/components/back-button'
export default function DashboardPage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const [myJobs, setMyJobs] = useState<JobWithProfile[]>([])
  const [myBids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch jobs created by the user
        const { data: jobsData } = await supabase
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

        setMyJobs(jobsData as unknown as [])

        
        const { data: bidsData } = await supabase
          .from('bids')
          .select(`
            *,
            profiles:repairer_id (
              full_name,
              avatar_url,
              rating
            )
          `)
          .eq('repairer_id', user.id)
          .order('created_at', { ascending: false })

        setBids(bidsData as unknown as  [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="px-8 py-8">
      <BackButton />

      <div className="mt-8 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className=" flex items-center space-x-4 ">
              {/* <div> */}
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || "" } />
                <AvatarFallback>{profile?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                <p className="text-muted-foreground">
                  {((profile?.role?.charAt(0)?.toUpperCase() ?? '') + (profile?.role?.slice(1) ?? '')) || ''}
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">{profile?.rating} ★</Badge>
                </div>
              </div>
              {/* </div> */}
              <div className="ml-auto ">
                <Button className="text-xs md:text:md" onClick={() => router.push('/post')}>
                  {profile?.role === 'requester' ? 'Post New Job' : 'Find Jobs'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">
            {profile?.role === 'requester' ? 'My Jobs' : 'My Bids'}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile?.role === 'requester' ? (
              myJobs.length>0?(
              myJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))): <p>No current Jobs.</p>
            ) : (
              myBids.map((bid) => (
                <Card key={bid.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Bid for ${bid.amount}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDistance(new Date(bid.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{bid.description}</p>
                    <Badge>{bid.status}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myJobs
                  .filter((job) => job.status === 'completed')
                  .map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}