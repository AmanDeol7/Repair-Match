'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { UserCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile } from '@/lib/types/profile'

interface RepairersMapProps {
  repairers: Profile[]
}

interface RepairerLocation {
  latitude: number
  longitude: number
  profile: Profile
}

export function RepairersMap({ repairers }: RepairersMapProps) {
  const [selectedRepairer, setSelectedRepairer] = useState<Profile | null>(null)
  const [repairerLocations, setRepairerLocations] = useState<RepairerLocation[]>([])
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

    // Geocode repairer locations
    const geocodeLocations = async () => {
      const locations = await Promise.all(
        repairers.map(async (repairer) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(repairer?.address || "Hyderabad")}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            )
            const data = await response.json()
            
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center
              return {
                latitude: lat,
                longitude: lng,
                profile: repairer
              }
            }
            return null
          } catch (error) {
            console.error('Error geocoding location:', error)
            return null
          }
        })
      )
      setRepairerLocations(locations.filter((loc): loc is RepairerLocation => loc !== null))
    }

    geocodeLocations()
  }, [repairers])

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {repairerLocations.map((location) => (
          <Marker
            key={location.profile.id}
            latitude={location.latitude}
            longitude={location.longitude}
          >
            <button
              className="text-[#006239] hover:text-[#2A7252] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setSelectedRepairer(location.profile)
              }}
            >
              <UserCircle className="h-6 w-6" />
            </button>
          </Marker>
        ))}

        {selectedRepairer && (
          <Popup
            latitude={repairerLocations.find(loc => loc.profile.id === selectedRepairer.id)?.latitude || 0}
            longitude={repairerLocations.find(loc => loc.profile.id === selectedRepairer.id)?.longitude || 0}
            onClose={() => setSelectedRepairer(null)}
            closeButton={true}
            closeOnClick={false}
            className="min-w-[300px]"
          >
            <Card className="border-0 shadow-none ">
              <CardHeader className="">
                <div className="flex items-center space-x-4 ">
                  <Avatar>
                    <AvatarImage src={selectedRepairer.logo|| ""} />
                    <AvatarFallback>{selectedRepairer.full_name ? selectedRepairer.full_name[0] : ""}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selectedRepairer.business_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedRepairer.address}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-[#006239] hover:bg-[#2A7252]">
                    {selectedRepairer.rating} ★
                  </Badge>
                </div>
                {selectedRepairer.bio && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedRepairer.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  )
}