'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void
}

export interface JobFilters {
  search: string
  category: string
  status: string
  sortBy: string
}

const CATEGORIES = [
  'All',
  'Electronics',
  'Appliances',
  'Furniture',
  'Plumbing',
  'Electrical',
  'Automotive',
  'Other',
]

const STATUSES = ['All', 'Open', 'In Progress', 'Completed']
const SORT_OPTIONS = ['Newest', 'Budget: High to Low', 'Budget: Low to High']

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    category: 'All',
    status: 'All',
    sortBy: 'Newest',
  })

  const handleChange = (key: keyof JobFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          className="pl-9"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          value={filters.category}
          onValueChange={(value) => handleChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleChange('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}