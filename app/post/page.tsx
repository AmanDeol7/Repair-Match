import { JobForm } from '@/components/jobs/job-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PostJobPage() {
  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Post a Repair Job</CardTitle>
        </CardHeader>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </div>
  )
}