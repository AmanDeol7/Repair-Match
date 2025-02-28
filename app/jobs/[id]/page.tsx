"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDistance } from "date-fns";
import { MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BidForm } from "@/components/jobs/bid-form";
import { BidList } from "@/components/jobs/bid-list";
import { supabase } from "@/lib/supabase/client";
import type { JobWithProfile } from "@/lib/types/job";
import type { Bid } from "@/lib/types/bid";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/back-button";
export default function JobDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const [job, setJob] = useState<JobWithProfile | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from("repair_jobs")
        .select(
          `*, profiles:requester_id (full_name, avatar_url, rating)`
        )
        .eq("id", id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData as unknown as JobWithProfile);

      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select(`*, profiles!inner(id, full_name, avatar_url, rating)`)
        .eq("job_id", id)
        .order("created_at", { ascending: false });

      if (bidsError) throw bidsError;
      setBids(bidsData as unknown as Bid[]);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const closeJob = async () => {
    if (!job) return;

    try {
      const { error } = await supabase
        .from("repair_jobs")
        .update({ status: "closed" })
        .eq("id", job.id);

      if (error) throw error;
      fetchJobDetails(); // Refresh job details
    } catch (error) {
      console.error("Error closing job:", error);
    }
  };

  if (loading || !job) {
    return <div>Loading...</div>;
  }

  const isRequester = user?.id === job.requester_id;
  const isRepairer = user?.id !== job.requester_id;
  const canBid = isRepairer && job.status === "open";
  const timeAgo = formatDistance(new Date(job.created_at), new Date(), {
    addSuffix: true,
  });

  return (
    <div className="px-[4rem] py-8">
      <div className="mb-4">
      <BackButton />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={job.profiles.avatar_url} />
                <AvatarFallback>{job.profiles.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{job.profiles.full_name}</p>
                <p className="text-sm text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
            <Badge variant={job.status === "open" ? "default" : "secondary"}>
              {job.status}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>{job.description}</p>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{job.category}</Badge>
              <p className="text-lg font-semibold">${job.budget}</p>
            </div>
          </div>

          <Tabs defaultValue="bids" className="w-full">
            <TabsList>
              <TabsTrigger value="bids">Bids ({bids.length})</TabsTrigger>
              {canBid && <TabsTrigger value="place-bid">Place Bid</TabsTrigger>}
            </TabsList>
            <TabsContent value="bids" className="mt-4">
              <BidList bids={bids} jobId={job.id} isRequester={isRequester} onBidAccepted={fetchJobDetails} />
            </TabsContent>
            {canBid && (
              <TabsContent value="place-bid" className="mt-4">
                <BidForm jobId={job.id} onBidSubmitted={fetchJobDetails} />
              </TabsContent>
            )}
          </Tabs>

          {isRequester && job.status === "open" && (
            <Button className="bg-red-700 hover:bg-red-800" onClick={closeJob}>
              Close Job
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
