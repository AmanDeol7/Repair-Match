import { Button } from '@/components/ui/button'
import { WrenchIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center items-center px-4 w-full">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className=" flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <WrenchIcon className="h-16 w-16" />
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Find skilled repairers in your area
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Post your repair job and connect with trusted professionals. Get competitive bids and track progress in real-time.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/post">Post a Job</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/jobs">Find Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Post Repair Jobs</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your repair needs and set your budget
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Get Competitive Bids</h3>
                <p className="text-sm text-muted-foreground">
                  Receive bids from qualified repairers near you
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Pay securely through our escrow system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}