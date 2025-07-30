'use client'

import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <Image 
              src="/gte-logo.svg" 
              alt="GTE Logo" 
              width={64} 
              height={64} 
              className="h-16 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">GTE Internal Management Tool</CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to access the team management system
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-6"
            size="lg"
          >
            <Chrome className="h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Access restricted to authorized users
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}