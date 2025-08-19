
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentTypes } from './ContentTypes';
import { ContentGenerator } from './ContentGenerator';
import { ContentCalendar } from './ContentCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';

export const ContentDashboard = () => {
  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-3" />
          HEMPSTAR CONTENT DOMINATION CENTER
        </CardTitle>
        <CardDescription className="text-hemp-dark/80 font-semibold text-lg">
          AI-powered content creation that makes your brand legendary across every platform
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generator" className="text-lg font-bold">
              <Rocket className="w-5 h-5 mr-2" />
              Content Generator
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-lg font-bold">
              <Calendar className="w-5 h-5 mr-2" />
              Content Calendar
            </TabsTrigger>
            <TabsTrigger value="types" className="text-lg font-bold">
              <Target className="w-5 h-5 mr-2" />
              Content Types
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <ContentGenerator />
          </TabsContent>
          
          <TabsContent value="calendar">
            <ContentCalendar />
          </TabsContent>
          
          <TabsContent value="types">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-black text-hemp-dark mb-2">
                  Content That Converts & Goes Viral
                </h3>
                <p className="text-muted-foreground font-semibold">
                  Choose the type of content you want to dominate with
                </p>
              </div>
              <ContentTypes />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-hemp-dark/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-hemp-primary mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-dark">89%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hemp-dark/10">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-hemp-accent mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-dark">247</div>
              <div className="text-sm text-muted-foreground">Posts Generated</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hemp-dark/10">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-dark">156K</div>
              <div className="text-sm text-muted-foreground">Total Reach</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hemp-dark/10">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-dark">$18K</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
