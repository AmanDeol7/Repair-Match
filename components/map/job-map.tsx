'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'

import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { JobWithProfile } from '@/lib/types/job'

interface JobMapProps {
  jobs: JobWithProfile[]
}

export default function JobMap({ jobs }: JobMapProps) {
  const [selectedJob, setSelectedJob] = useState<JobWithProfile | null>(null)
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 11
  })

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 11
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])



  return (
    <div className="h-[600px] w-full  rounded-lg overflow-hidden">
      <Map 
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {jobs.map((job) => (
          <Marker
            key={job.id}
            latitude={job.latitude}
            longitude={job.longitude}
          >
            <button
              className="text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setSelectedJob(job)
              }}
            >
              <MapPin className="h-6 w-6" />
            </button>
          </Marker>
        ))}

        {selectedJob && (
          <Popup
            latitude={selectedJob.latitude}
            longitude={selectedJob.longitude}
            onClose={() => setSelectedJob(null)}
            closeButton={true}
            closeOnClick={false}
            className="min-w-[300px]"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{selectedJob.title}</CardTitle>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline">{selectedJob.category}</Badge>
                  <span className="font-semibold">${selectedJob.budget}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {selectedJob.description}
                </p>
                <Button asChild className="w-full">
                  <Link href={`/jobs/${selectedJob.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  )
}