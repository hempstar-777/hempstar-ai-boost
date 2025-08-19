
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { User, Crown, Shield, Zap } from 'lucide-react';

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    toast({
      title: "VIP Access Active",
      description: "VIP Creator access cannot be disabled",
      variant: "default",
    });
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              VIP Creator
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Badge variant="default" className="flex items-center bg-yellow-500 text-black">
              <Crown className="h-3 w-3 mr-1" />
              VIP
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Creator
            </Badge>
          </div>
        </div>
        <CardDescription className="text-primary/80 font-medium">
          Unlimited Hempstar AI Access • All Features Unlocked
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Creator Email</div>
          <div className="text-sm font-semibold text-primary">{user.email}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground">Access Level</div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">Unlimited AI Executions</span>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground">VIP Features</div>
          <div className="text-xs space-y-1 mt-1">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-500" /> Enhanced AI Agents
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-500" /> Premium Analytics
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-500" /> Priority Support
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground">Creator ID</div>
          <div className="text-xs font-mono bg-primary/10 text-primary p-2 rounded border">
            {user.id}
          </div>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-primary/20 hover:bg-primary/5"
          disabled
        >
          <Crown className="mr-2 h-4 w-4" />
          VIP Access Active
        </Button>
      </CardContent>
    </Card>
  );
};
