'use client'

import { Button } from '@/components/ui/button'
import { WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import Profile from './Profile'
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { NotificationBell } from './notifications/notification-bell'

export function Navbar() {

  const { user, isAuthenticated } = useAuth();
    const userId = user?.id;
   
    const { data: profile } = useProfile(userId);
    console.log(profile)
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 md:px-4 overflow-hidden">
      <div className="  flex h-14 items-center">
        <div className=" flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WrenchIcon className="h-6 w-6" />
            <span className="font-bold">RepairMatch</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2 ">
            
            {profile?.role =="repairer" && (
              <Button variant="ghost" className="hidden md:block" asChild>
              
                  <Link href="/jobs">Find Jobs</Link>
               
              </Button>
            )}
            
            {profile?.role =="requester" && <Button variant="ghost" className='hidden md:block' asChild>
              <Link href="/post">Post Job</Link></Button>} 
            
            {profile?.role =="requester" && <Button variant="ghost"  className='hidden md:block' asChild>
              <Link href="/repairers">Find Repairers</Link>
            </Button>}
            <ThemeToggle />
            <NotificationBell />
            <Profile/>
            
          </nav>
        </div>
      </div>
    </header>
  )
}