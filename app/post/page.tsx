import { JobForm } from '@/components/jobs/job-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BackButton from '@/components/back-button'
export default function PostJobPage() {
  return (
    <div className="px-[4rem] py-8">
      <div className="mb-4">
            <BackButton />
      </div>
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