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
  'Electronics', 'Appliances', 'Furniture', 'Plumbing', 'Electrical', 'Automotive', 'Other',
]

export function JobForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [suggestions, setSuggestions] = useState<{ place_name: string, center: [number, number] }[]>([])
  
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Fetch location suggestions from Mapbox
  const handleLocationChange = async (query: string) => {
    setLocation(query)
    if (!query) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&limit=5`
      )
      const data = await response.json()

      if (data.features) {
        setSuggestions(data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center,
        })))
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
    }
  }

  // Handle selection of a suggested location
  const handleSelectLocation = (place: { place_name: string, center: [number, number] }) => {
    setLocation(place.place_name)
    setLatitude(place.center[1].toString())
    setLongitude(place.center[0].toString())
    setSuggestions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('repair_jobs').insert({
        title,
        description,
        budget: parseFloat(budget),
        category,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        requester_id: user.id,
      })

      if (error) throw error

      toast({ title: 'Success!', description: 'Your repair job has been posted.' })
      router.push('/jobs/my-jobs')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be repaired?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the repair needed in detail..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input id="budget" type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter your budget" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="Enter your location"
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded shadow-md w-full mt-1">
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectLocation(place)}
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" className="w-full">Post Job</Button>
    </form>
  )
}
