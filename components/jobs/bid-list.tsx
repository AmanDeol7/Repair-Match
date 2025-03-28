'use client'

import { formatDistance } from 'date-fns'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Bid } from '@/lib/types/bid'

type BidStatus = 'pending' | 'accepted' | 'rejected'

interface BidListProps {
  bids: (Bid & { status: BidStatus })[]
  jobId: string
  isRequester: boolean
  onBidAccepted: () => void
}

export function BidList({ bids, jobId, isRequester, onBidAccepted }: BidListProps) {
  const { toast } = useToast()
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>(null)

  const handleAcceptBid = async (bidId: string) => {
    try {
      // Update bid status
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId)

      if (bidError) throw bidError

      // Update job status and assign repairer
      const { error: jobError } = await supabase
        .from('repair_jobs')
        .update({
          status: 'in_progress',
          repairer_id: bids.find(b => b.id === bidId)?.repairer_id
        })
        .eq('id', jobId)

      if (jobError) throw jobError

      // Update local state
      setAcceptedBidId(bidId)

      toast({
        title: 'Success!',
        description: 'Bid accepted successfully.',
      })

      onBidAccepted()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <Card key={bid.id}>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={bid.profiles.avatar_url} />
                  <AvatarFallback>{bid.profiles.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{bid.profiles.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistance(new Date(bid.created_at), new Date(), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${bid.amount}</p>
                <p className="text-sm text-muted-foreground">{bid.estimated_days} days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{bid.description}</p>
            {isRequester && bid.status === 'pending' && (
              <Button
                onClick={() => handleAcceptBid(bid.id)}
                className="mt-4"
                size="sm"
                disabled={acceptedBidId === bid.id}
              >
                {acceptedBidId === bid.id ? 'Bid Accepted' : 'Accept Bid'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
