'use client'

import { Button } from '@/components/ui/button'
import { WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 md:px-4">
      <div className="  flex h-14 items-center">
        <div className=" flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WrenchIcon className="h-6 w-6" />
            <span className="font-bold">RepairMatch</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/jobs">Find Jobs</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/post">Post Job</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/repairers">Find Repairers</Link>
            </Button>
            <ThemeToggle />
            <Button variant="default" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}