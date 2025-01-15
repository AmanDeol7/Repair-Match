import { JobList } from '@/components/jobs/job-list'

export default function JobsPage() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Repair Jobs</h1>
      <JobList />
    </div>
  )
}