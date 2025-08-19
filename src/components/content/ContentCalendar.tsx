
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const contentSchedule = [
  {
    day: 'Monday',
    time: '9:00 AM',
    type: 'Blog Post',
    title: 'Hemp Fashion Trend Analysis',
    platform: 'Website + SEO',
    status: 'scheduled',
    engagement: '2.3K views expected'
  },
  {
    day: 'Monday',
    time: '2:00 PM',
    type: 'Instagram Post',
    title: 'Behind-the-scenes embroidery',
    platform: 'Instagram',
    status: 'ready',
    engagement: '850 likes expected'
  },
  {
    day: 'Tuesday',
    time: '11:00 AM',
    type: 'TikTok Video',
    title: 'Hemp vs Cotton durability test',
    platform: 'TikTok',
    status: 'in-progress',
    engagement: '15K views expected'
  },
  {
    day: 'Tuesday',
    time: '4:00 PM',
    type: 'Email Campaign',
    title: 'New Hemp Hoodie Drop Alert',
    platform: 'Email List',
    status: 'scheduled',
    engagement: '32% open rate expected'
  },
  {
    day: 'Wednesday',
    time: '10:00 AM',
    type: 'Twitter Thread',
    title: 'Sustainable streetwear revolution',
    platform: 'Twitter',
    status: 'draft',
    engagement: '500 retweets expected'
  },
  {
    day: 'Wednesday',
    time: '6:00 PM',
    type: 'Facebook Ad',
    title: 'Limited Edition Collection Launch',
    platform: 'Facebook Ads',
    status: 'scheduled',
    engagement: '3.2% CTR expected'
  },
  {
    day: 'Thursday',
    time: '1:00 PM',
    type: 'YouTube Short',
    title: 'Embroidery process time-lapse',
    platform: 'YouTube',
    status: 'ready',
    engagement: '5K views expected'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-green-500/20 text-green-700 border-green-500/40';
    case 'ready': return 'bg-blue-500/20 text-blue-700 border-blue-500/40';
    case 'in-progress': return 'bg-orange-500/20 text-orange-700 border-orange-500/40';
    case 'draft': return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    default: return 'bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled': return CheckCircle;
    case 'ready': return Zap;
    case 'in-progress': return Clock;
    case 'draft': return AlertCircle;
    default: return Target;
  }
};

export const ContentCalendar = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const filteredContent = contentSchedule.filter(item => item.day === selectedDay);
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-black text-hemp-primary">
            <Calendar className="w-8 h-8 mr-3" />
            Content Domination Calendar
          </CardTitle>
          <p className="text-muted-foreground font-semibold">
            Your automated content schedule to keep hempstar.store trending 24/7
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Day Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {weekDays.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className={selectedDay === day 
                  ? "bg-hemp-primary text-hemp-dark font-bold" 
                  : "hover:bg-hemp-primary/10"
                }
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Content Schedule */}
          <div className="space-y-4">
            {filteredContent.map((item, index) => {
              const StatusIcon = getStatusIcon(item.status);
              
              return (
                <Card key={index} className="border-l-4 border-l-hemp-accent hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <Clock className="w-5 h-5 text-muted-foreground mb-1" />
                          <span className="text-sm font-bold">{item.time}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40 font-bold">
                              {item.type}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {item.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <h3 className="font-bold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Platform: {item.platform}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className="bg-green-500/20 text-green-700 border-green-500/40 mb-2">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {item.engagement}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button size="sm" className="bg-hemp-accent text-hemp-dark">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Weekly Summary */}
          <Card className="mt-6 bg-gradient-hemp/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-hemp-primary">47</div>
                  <div className="text-sm text-muted-foreground">Posts This Week</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-hemp-accent">156K</div>
                  <div className="text-sm text-muted-foreground">Expected Reach</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-green-600">$12K</div>
                  <div className="text-sm text-muted-foreground">Projected Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
