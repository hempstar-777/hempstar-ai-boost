
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Shield } from 'lucide-react';

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
          <Badge variant="secondary" className="flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        </div>
        <CardDescription>
          Manage your Hempstar AI account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Email</div>
          <div className="text-sm">{user.email}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground">User ID</div>
          <div className="text-xs font-mono bg-muted p-2 rounded">
            {user.id}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground">Account Created</div>
          <div className="text-sm">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};
