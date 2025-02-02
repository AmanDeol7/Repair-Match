'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { FcGoogle } from 'react-icons/fc'
export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'requester' | 'repairer'>('requester')
  const { toast } = useToast()
  const router = useRouter()
  const {user, isLoading, isAuthenticated} = useAuth();
  const [businessName, setBusinessName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Signup logic
        const { data: authData, error: authError } = await supabase.auth.signUp({
          

          email,
          password,
        });
        if (authError) throw authError;
        
        const profileData: any = {
          id: authData.user!.id,
          email,
          password,
          full_name: fullName,
          role,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
        }

        // Include repairer-specific fields
        if (role === 'repairer') {
          profileData.business_name = businessName
          profileData.address = address
          profileData.city = city
          profileData.pincode = pincode
        }

        const { error: profileError } = await supabase.from('profiles').insert(profileData)
        if (profileError) throw profileError
       
        
  
        toast({
          title: 'Account created!',
          description: 'Please sign in with your credentials.',
        });
        setIsSignUp(false);
      } else {
        // Sign-in logic
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
  
        // const { data: profile } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('email', email)
        //   .single();
        
  
        // if (!user) throw new Error('Profile not found.');
        toast({
          title: 'user signed in',
          description: '',
        });
        router.push('/dashboard');
        
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };
  if( isAuthenticated){
    router.push("/dashboard");
    
  }

  const handleSignInWithOauth = (provider:"google")=> {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin+ "/auth/callback"
      }
    });

  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {isSignUp && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as 'requester' | 'repairer')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="requester" id="requester" />
                <Label htmlFor="requester">Requester</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="repairer" id="repairer" />
                <Label htmlFor="repairer">Repairer</Label>
              </div>
            </RadioGroup>
          </div>
          {role === 'repairer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </>
          )}
        </>
      )}

      <Button type="submit" className="w-full">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      <Button type='button' variant="outline" className='w-full' onClick={() => handleSignInWithOauth("google")}> <FcGoogle size={20}/>  {isSignUp ? 'Sign up with Google' : "Sign in with Google"}</Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
      </Button>
    </form>
  )
}