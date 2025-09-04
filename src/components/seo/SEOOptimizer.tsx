import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon,
  FileText,
  Link,
  Zap,
  Eye,
  BarChart3
} from "lucide-react";

interface SEOScore {
  overall: number;
  titleTags: number;
  metaDescriptions: number;
  headings: number;
  altText: number;
  contentQuality: number;
}

interface SEOIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: string;
  message: string;
  page?: string;
  fix?: string;
}

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  opportunity: number;
}

export const SEOOptimizer: React.FC = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  // Mock SEO data - would come from actual site analysis
  const seoScore: SEOScore = {
    overall: 72,
    titleTags: 85,
    metaDescriptions: 60,
    headings: 90,
    altText: 45,
    contentQuality: 70
  };

  const seoIssues: SEOIssue[] = [
    {
      type: 'critical',
      category: 'Images',
      message: '12 product images missing alt text',
      page: '/products',
      fix: 'Add descriptive alt text for all artwork and clothing images'
    },
    {
      type: 'warning',
      category: 'Meta Descriptions',
      message: '3 pages have meta descriptions over 160 characters',
      page: '/collections',
      fix: 'Shorten meta descriptions to improve search snippets'
    },
    {
      type: 'suggestion',
      category: 'Content',
      message: 'Consider adding blog content about artist collaborations',
      fix: 'Create content about your unique artist partnership process'
    },
    {
      type: 'warning',
      category: 'Links',
      message: 'Internal linking could be improved',
      fix: 'Add more links between related products and artist pages'
    }
  ];

  const keywordOpportunities: KeywordData[] = [
    { keyword: 'artist designed clothing', volume: 1200, difficulty: 45, opportunity: 85 },
    { keyword: 'hemp streetwear', volume: 800, difficulty: 35, opportunity: 90 },
    { keyword: 'unique canvas art', volume: 2100, difficulty: 55, opportunity: 70 },
    { keyword: 'sustainable fashion art', volume: 950, difficulty: 40, opportunity: 80 },
    { keyword: 'handmade sculptures', volume: 1500, difficulty: 50, opportunity: 75 }
  ];

  const handleSEOScan = async () => {
    setIsScanning(true);
    toast({
      title: "SEO Scan Started",
      description: "Analyzing hempstar.store for optimization opportunities...",
    });
    
    // Mock scan process
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "SEO Scan Complete",
        description: "Found 4 issues to improve your search visibility.",
      });
    }, 3000);
  };

  const handleGenerateContent = async (contentType: string, keyword: string) => {
    if (!keyword) {
      toast({
        title: "Keyword Required",
        description: "Please select a keyword to generate content for.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Generating Content",
      description: `Creating SEO-optimized ${contentType} for "${keyword}"...`,
    });

    // Mock content generation - would use AI here
    setTimeout(() => {
      const mockContent = contentType === 'meta description' 
        ? `Discover unique ${keyword} at Hempstar.Store. Shop exclusive artist collaborations featuring sustainable hemp-based designs. Free shipping on orders over $75.`
        : `# The Art of ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}

At Hempstar.Store, we believe ${keyword} represents more than just fashion - it's a statement of individuality and sustainability.

## Why Choose Our ${keyword}?

Our ${keyword} collection features:
- Exclusive artist collaborations
- Sustainable hemp materials
- Limited edition designs
- Direct support for independent artists

Each piece in our ${keyword} line tells a story, connecting you with the creative vision of talented artists who share our commitment to quality and environmental responsibility.`;

      setGeneratedContent(mockContent);
      toast({
        title: "Content Generated",
        description: `SEO-optimized ${contentType} is ready for review and use.`,
      });
    }, 2000);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* SEO Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Health Check - Hempstar.Store
              </CardTitle>
              <CardDescription>
                Optimize your site for better search visibility and more organic traffic
              </CardDescription>
            </div>
            <Button 
              onClick={handleSEOScan} 
              disabled={isScanning}
              className="min-w-[120px]"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run SEO Scan
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.overall)}`}>
                {seoScore.overall}
              </div>
              <div className="text-xs text-muted-foreground">Overall Score</div>
              <Progress value={seoScore.overall} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.titleTags)}`}>
                {seoScore.titleTags}
              </div>
              <div className="text-xs text-muted-foreground">Title Tags</div>
              <Progress value={seoScore.titleTags} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.metaDescriptions)}`}>
                {seoScore.metaDescriptions}
              </div>
              <div className="text-xs text-muted-foreground">Meta Desc.</div>
              <Progress value={seoScore.metaDescriptions} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.headings)}`}>
                {seoScore.headings}
              </div>
              <div className="text-xs text-muted-foreground">Headings</div>
              <Progress value={seoScore.headings} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.altText)}`}>
                {seoScore.altText}
              </div>
              <div className="text-xs text-muted-foreground">Alt Text</div>
              <Progress value={seoScore.altText} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(seoScore.contentQuality)}`}>
                {seoScore.contentQuality}
              </div>
              <div className="text-xs text-muted-foreground">Content</div>
              <Progress value={seoScore.contentQuality} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="content">Content Gen</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                SEO Issues & Recommendations
              </CardTitle>
              <CardDescription>
                Priority fixes to improve your search ranking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={issue.type === 'critical' ? 'destructive' : issue.type === 'warning' ? 'default' : 'secondary'}>
                          {issue.type}
                        </Badge>
                        <span className="text-sm font-medium">{issue.category}</span>
                        {issue.page && (
                          <span className="text-xs text-muted-foreground">{issue.page}</span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{issue.message}</p>
                      {issue.fix && (
                        <p className="text-xs text-muted-foreground">
                          <strong>Fix:</strong> {issue.fix}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      Fix Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Keyword Opportunities
              </CardTitle>
              <CardDescription>
                High-potential keywords for your artist-focused niche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordOpportunities.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{keyword.keyword}</span>
                        <Badge variant="outline" className="text-xs">
                          {keyword.opportunity}% opportunity
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Volume:</span> {keyword.volume}/mo
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span> {keyword.difficulty}/100
                        </div>
                        <div>
                          <Progress value={keyword.opportunity} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedKeyword(keyword.keyword)}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Create SEO-optimized content for your selected keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Selected Keyword</label>
                <Input
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  placeholder="Select a keyword from the opportunities tab or enter your own"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleGenerateContent('meta description', selectedKeyword)}
                  variant="outline"
                  className="h-auto p-4 flex-col"
                  disabled={!selectedKeyword}
                >
                  <Search className="h-6 w-6 mb-2" />
                  <span>Meta Description</span>
                </Button>
                <Button 
                  onClick={() => handleGenerateContent('product description', selectedKeyword)}
                  variant="outline"
                  className="h-auto p-4 flex-col"
                  disabled={!selectedKeyword}
                >
                  <ImageIcon className="h-6 w-6 mb-2" />
                  <span>Product Description</span>
                </Button>
                <Button 
                  onClick={() => handleGenerateContent('blog post', selectedKeyword)}
                  variant="outline"
                  className="h-auto p-4 flex-col"
                  disabled={!selectedKeyword}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Blog Post</span>
                </Button>
              </div>

              {generatedContent && (
                <div className="mt-6">
                  <label className="text-sm font-medium mb-2 block">Generated Content</label>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm">Use This Content</Button>
                    <Button size="sm" variant="outline">Copy to Clipboard</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Search Performance
                </CardTitle>
                <CardDescription>How your site appears in search results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Position</span>
                  <Badge variant="outline">15.3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Click-through Rate</span>
                  <Badge variant="outline">3.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Impressions</span>
                  <Badge variant="outline">12.4K/mo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clicks</span>
                  <Badge variant="outline">398/mo</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Performing Pages
                </CardTitle>
                <CardDescription>Pages driving the most organic traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>/collections/canvas-art</span>
                    <Badge variant="secondary">152 clicks</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>/products/hemp-hoodie</span>
                    <Badge variant="secondary">98 clicks</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>/artists/hemp-collective</span>
                    <Badge variant="secondary">76 clicks</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>/about</span>
                    <Badge variant="secondary">54 clicks</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOOptimizer;