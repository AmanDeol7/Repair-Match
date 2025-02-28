'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  )
}
