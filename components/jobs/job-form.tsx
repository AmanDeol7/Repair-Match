'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

const CATEGORIES = [
  'Electronics',
  'Appliances',
  'Furniture',
  'Plumbing',
  'Electrical',
  'Automotive',
  'Other',
]

export function JobForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLocationSearch = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setLatitude(lat.toString())
        setLongitude(lng.toString())
      }
    } catch (error) {
      console.error('Error geocoding address:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // Geocode the location if coordinates aren't set
      if (!latitude || !longitude) {
        await handleLocationSearch(location)
      }

      const { error } = await supabase.from('repair_jobs').insert({
        title,
        description,
        budget: parseFloat(budget),
        category,
        location,
        latitude:parseFloat(latitude),
        longitude:parseFloat(longitude),
        requester_id: user.id,
      })

      if (error) throw error

      toast({
        title: 'Success!',
        description: 'Your repair job has been posted.',
      })
      router.push('/jobs')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be repaired?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the repair needed in detail..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          min="0"
          step="0.01"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter your budget"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            // Clear coordinates when location changes
            setLatitude('')
            setLongitude('')
          }}
          onBlur={() => handleLocationSearch(location)}
          placeholder="Enter your location"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Post Job
      </Button>
    </form>
  )
}