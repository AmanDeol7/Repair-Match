'use client'

import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "./ui/button";
import Link from "next/link";

const JobSelect = () => {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id;

    const { data: profile } = useProfile(userId);

    return (
        <div className="space-x-4">
            {isAuthenticated ? (
                profile?.role === "repairer" ? (
                    <>
                    <Button size="lg"  asChild>
                        <Link href="/jobs">Find Jobs</Link>
                    </Button>
                     <Button size="lg" variant={"outline"} asChild>
                     <Link href="/jobs/my-jobs">My Jobs</Link>
                     </Button>
                     </>
                ) : (
                    <>
                    <Button size="lg" className="custom-green" asChild>
                        <Link href="/post">Post a Job</Link>
                    </Button>
                    <Button size="lg" variant={"outline"} asChild>
                    <Link href="/jobs/my-jobs">My Jobs</Link>
                    </Button>
                </>
                )
            ) : (
                <>
                    <Button size="lg" className="" asChild>
                        <Link href="/signin">Find Jobs</Link>
                    </Button>
                    <Button size="lg" variant="outline"  asChild>
                        <Link href="/signin">Post a Job</Link>
                    </Button>
                </>
            )}
        </div>
    )
}

export default JobSelect;
