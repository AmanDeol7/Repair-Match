'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'

interface BidFormProps {
  jobId: string
  onBidSubmitted: () => void
}

export function BidForm({ jobId, onBidSubmitted }: BidFormProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('bids').insert({
        job_id: jobId,
        repairer_id: user.id,
        amount: parseFloat(amount),
        description,
        estimated_days: parseInt(estimatedDays),
      })

      if (error) throw error

      toast({
        title: 'Success!',
        description: 'Your bid has been submitted.',
      })
      onBidSubmitted()
      setAmount('')
      setDescription('')
      setEstimatedDays('')
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
        <Label htmlFor="amount">Bid Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Proposal</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe how you'll handle the repair..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedDays">Estimated Days to Complete</Label>
        <Input
          id="estimatedDays"
          type="number"
          min="1"
          value={estimatedDays}
          onChange={(e) => setEstimatedDays(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Bid
      </Button>
    </form>
  )
}