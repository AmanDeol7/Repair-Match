import { formatDistance } from 'date-fns'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { JobWithProfile } from '@/lib/types/job'
import Link from 'next/link'

interface JobCardProps {
  job: JobWithProfile
}

export function JobCard({ job }: JobCardProps) {
  const timeAgo = formatDistance(new Date(job.created_at), new Date(), { addSuffix: true })
  
  return (
    <Card className=''>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={job.profiles.avatar_url} />
              <AvatarFallback>{job.profiles.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{job.profiles.full_name}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
            {job.status}
          </Badge>
        </div>
        <h3 className="font-semibold">{job.title}</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{job.category}</Badge>
          <p className="font-semibold">${job.budget}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}