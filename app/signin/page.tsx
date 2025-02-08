import { AuthForm } from '@/components/auth/auth-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  return (
    <div className=" flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
     
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to RepairMatch</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  )
}