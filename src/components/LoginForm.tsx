
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthProvider';
import { Brain, Loader2 } from 'lucide-react';
import { DeviceTrust } from '@/utils/deviceTrust';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink, signUp, signInWithGoogle, signInWithPhone, verifyPhoneOtp } = useAuth();
  const { toast } = useToast();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setMagicLinkSent(true);
        toast({
          title: "Check your email!",
          description: "We sent you a magic link to sign in. Click the link in your email to continue.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      toast({
        title: 'Redirecting to Google…',
        description: 'Complete sign-in and you’ll be brought back automatically.',
      });
      // Do not set loading to false here; the page will redirect.
    }
  };

  const afterSuccessfulLogin = (identifier?: string) => {
    if (trustDevice) {
      DeviceTrust.markTrusted(identifier);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to Hempstar AI",
        });
        afterSuccessfulLogin(email);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to Hempstar AI. You can now access all features.",
        });
        afterSuccessfulLogin(email);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({ title: 'Enter phone number', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signInWithPhone(phone);
    if (error) {
      toast({ title: 'SMS failed', description: error.message, variant: 'destructive' });
    } else {
      setOtpSent(true);
      toast({ title: 'Code sent', description: 'Check your SMS for the 6-digit code.' });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({ title: 'Enter the code from SMS', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await verifyPhoneOtp(phone, otp);
    if (error) {
      toast({ title: 'Invalid code', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed in!', description: 'Phone verified successfully.' });
      afterSuccessfulLogin(phone);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-2">
            <Brain className="h-8 w-8 text-primary mr-2" />
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hempstar AI
            </CardTitle>
          </div>
          <CardDescription>
            Access your AI-powered hemp store intelligence platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="magic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
              <TabsTrigger value="signin">Password</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="magic">
              <div className="space-y-4">
                {magicLinkSent ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We sent a magic link to <span className="font-mono">{email}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click the link in your email to sign in instantly (no password needed)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setMagicLinkSent(false)}
                    >
                      Send another link
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <Label htmlFor="magic-email">Email</Label>
                      <Input
                        id="magic-email"
                        type="email"
                        placeholder="chidoweywey@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        No password required - we'll email you a magic link
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending magic link...
                        </>
                      ) : (
                        'Send Magic Link'
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="signin">
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/30 text-foreground"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {/* Simple Google "G" */}
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.6 3.6-5.2 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 6 12 6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.9 3.7 14.7 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.9 0 9.2-4.9 9.2-7.3 0-.5-.1-.9-.1-1.3H12z"/>
                  </svg>
                  Continue with Google
                </Button>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="trust-email" type="checkbox" checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} />
                    <Label htmlFor="trust-email" className="text-sm">Trust this device</Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="phone">
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number">Phone number</Label>
                      <Input
                        id="phone-number"
                        type="tel"
                        placeholder="+1 438 878 4277"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="trust-phone" type="checkbox" checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} />
                      <Label htmlFor="trust-phone" className="text-sm">Trust this device</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : 'Send Code'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter 6-digit code</Label>
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>) : 'Verify & Sign In'}
                    </Button>
                  </form>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/30 text-foreground"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.6 3.6-5.2 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 6 12 6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.9 3.7 14.7 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.9 0 9.2-4.9 9.2-7.3 0-.5-.1-.9-.1-1.3H12z"/>
                  </svg>
                  Continue with Google
                </Button>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 6 characters long
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="trust-signup" type="checkbox" checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} />
                    <Label htmlFor="trust-signup" className="text-sm">Trust this device</Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-primary">Creator Access</p>
            <p className="font-mono text-xs mt-1">Use your email: chidoweywey@gmail.com</p>
            <p className="text-xs mt-1">or hempstar777@yahoo.ca</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
