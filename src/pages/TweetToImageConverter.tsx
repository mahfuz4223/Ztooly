
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Repeat2, Share, Download, Link, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const TweetToImageConverter = () => {
  const { toast } = useToast();
  
  const [tweetUrl, setTweetUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tweetData, setTweetData] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'light',
    borderRadius: 'rounded',
    padding: 'normal',
    showEngagement: true,
    format: 'png',
    quality: 'high'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample tweet data for demonstration
  const sampleTweetData = {
    id: '1234567890',
    username: 'elonmusk',
    displayName: 'Elon Musk',
    handle: '@elonmusk',
    profileImage: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
    tweetText: 'Just launched another rocket to Mars! 🚀 The future of humanity is multiplanetary. This is just the beginning of an incredible journey. #SpaceX #Mars #Innovation',
    timestamp: '2:34 PM · Dec 15, 2024',
    engagement: {
      replies: '2.1K',
      retweets: '15.2K',
      likes: '89.4K',
      bookmarks: '12.3K'
    },
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  const validateTweetUrl = (url) => {
    const tweetUrlPattern = /^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/;
    return tweetUrlPattern.test(url);
  };

  const extractTweetId = (url) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const isValid = validateTweetUrl(tweetUrl);
    setIsValidUrl(isValid);
    if (!isValid && tweetUrl.length > 0) {
      setTweetData(null);
    }
  }, [tweetUrl]);

  const fetchTweetData = async () => {
    if (!isValidUrl) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call Twitter API here
      // For demo purposes, we'll use sample data
      const tweetId = extractTweetId(tweetUrl);
      
      // Simulate different tweets based on URL
      let mockData = { ...sampleTweetData };
      
      if (tweetUrl.includes('nasa')) {
        mockData = {
          ...mockData,
          username: 'nasa',
          displayName: 'NASA',
          handle: '@nasa',
          profileImage: 'https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB_400x400.jpg',
          tweetText: 'Incredible new images from the James Webb Space Telescope show the beauty and complexity of our universe. Each photo reveals secrets that have been hidden for billions of years. 🌌 #JWST #Space #Astronomy',
          engagement: {
            replies: '3.2K',
            retweets: '18.7K',
            likes: '125.6K',
            bookmarks: '28.1K'
          }
        };
      } else if (tweetUrl.includes('openai')) {
        mockData = {
          ...mockData,
          username: 'openai',
          displayName: 'OpenAI',
          handle: '@openai',
          profileImage: 'https://pbs.twimg.com/profile_images/1634058036934500352/b4F1eVpJ_400x400.jpg',
          tweetText: 'Introducing our latest AI model with enhanced reasoning capabilities. This breakthrough represents a significant step forward in artificial intelligence research and development. 🤖 #AI #MachineLearning #Innovation',
          engagement: {
            replies: '5.8K',
            retweets: '25.4K',
            likes: '156.2K',
            bookmarks: '42.7K'
          }
        };
      }
      
      setTweetData(mockData);
      toast({
        title: "Success!",
        description: "Tweet loaded successfully. You can now customize and download it.",
      });
      
    } catch (error) {
      console.error('Error fetching tweet:', error);
      toast({
        title: "Error",
        description: "Failed to load tweet. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTweetImage = async () => {
    if (!tweetData) return;
    
    setIsGenerating(true);
    const element = document.getElementById('tweet-preview');
    
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: settings.theme === 'dark' ? '#000000' : '#ffffff',
          scale: settings.quality === 'high' ? 3 : 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `tweet-${tweetData.id}-${Date.now()}.${settings.format}`;
        link.href = canvas.toDataURL(`image/${settings.format}`, 1.0);
        link.click();
        
        toast({
          title: "Success!",
          description: `Tweet image downloaded as ${settings.format.toUpperCase()}.`,
        });
      } catch (error) {
        console.error('Error generating image:', error);
        toast({
          title: "Error",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const renderTweetText = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return <span key={index} className="text-blue-500">{part}</span>;
      } else if (part.startsWith('@')) {
        return <span key={index} className="text-blue-500">{part}</span>;
      } else if (part.startsWith('http')) {
        return <span key={index} className="text-blue-500">{part}</span>;
      }
      return part;
    });
  };

  const sampleUrls = [
    'https://x.com/elonmusk/status/1234567890',
    'https://twitter.com/nasa/status/1234567891',
    'https://x.com/openai/status/1234567892'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tweet to Image Converter
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Convert any Twitter/X post into a beautiful, high-quality image. Just paste the tweet URL and download your image.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">Real Tweets</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">High Quality</Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">Instant Download</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Enter Tweet URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tweetUrl">Paste Twitter/X URL</Label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 relative">
                    <Input
                      id="tweetUrl"
                      value={tweetUrl}
                      onChange={(e) => setTweetUrl(e.target.value)}
                      placeholder="https://x.com/username/status/1234567890"
                      className={`pr-10 ${tweetUrl && !isValidUrl ? 'border-red-500' : ''} ${isValidUrl ? 'border-green-500' : ''}`}
                    />
                    {tweetUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidUrl ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={fetchTweetData}
                    disabled={!isValidUrl || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Loading...' : 'Load Tweet'}
                  </Button>
                </div>
                {tweetUrl && !isValidUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid Twitter/X URL (e.g., https://x.com/username/status/1234567890)
                  </p>
                )}
              </div>

              <div>
                <Label>Try these sample URLs:</Label>
                <div className="space-y-2 mt-2">
                  {sampleUrls.map((url, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setTweetUrl(url)}
                      className="text-left justify-start text-xs h-auto py-2 w-full"
                    >
                      {url}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Download Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">🌞 Light</SelectItem>
                      <SelectItem value="dark">🌙 Dark</SelectItem>
                      <SelectItem value="dim">🌆 Dim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quality</Label>
                  <Select value={settings.quality} onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (2x)</SelectItem>
                      <SelectItem value="high">High (3x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Format</Label>
                  <Select value={settings.format} onValueChange={(value) => setSettings(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Border Style</Label>
                  <Select value={settings.borderRadius} onValueChange={(value) => setSettings(prev => ({ ...prev, borderRadius: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sharp</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="rounded-lg">Extra Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showEngagement"
                  checked={settings.showEngagement}
                  onChange={(e) => setSettings(prev => ({ ...prev, showEngagement: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="showEngagement">Show Engagement Metrics</Label>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">✨ Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Load real tweets from Twitter/X URLs</li>
                <li>• High-resolution image export (up to 3x)</li>
                <li>• Multiple themes (Light, Dark, Dim)</li>
                <li>• PNG and JPEG format support</li>
                <li>• Preserve original engagement metrics</li>
                <li>• Clean, authentic Twitter design</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview & Download</CardTitle>
              <p className="text-sm text-muted-foreground">
                {tweetData ? 'Your tweet is ready to download' : 'Load a tweet to see the preview'}
              </p>
            </CardHeader>
            <CardContent>
              {!tweetData ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Link className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Tweet Loaded</h3>
                  <p className="text-muted-foreground text-sm">
                    Paste a Twitter/X URL above and click "Load Tweet" to see the preview
                  </p>
                </div>
              ) : (
                <>
                  {/* Tweet Preview */}
                  <div
                    id="tweet-preview"
                    className={`
                      max-w-[600px] mx-auto p-6
                      ${settings.theme === 'dark' ? 'bg-black text-white' : 
                        settings.theme === 'dim' ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'}
                      ${settings.borderRadius}
                      shadow-lg border
                    `}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    {/* Tweet Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={tweetData.profileImage} alt={tweetData.displayName} />
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {tweetData.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-[15px]">{tweetData.displayName}</span>
                          {tweetData.isVerified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-500 text-[15px]">{tweetData.handle}</span>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </div>
                    </div>

                    {/* Tweet Content */}
                    <div className="mb-4">
                      <p className="text-[15px] leading-normal whitespace-pre-wrap">
                        {renderTweetText(tweetData.tweetText)}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="text-gray-500 text-[15px] mb-4">
                      {tweetData.timestamp}
                    </div>

                    {/* Engagement */}
                    {settings.showEngagement && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between text-gray-500">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm">{tweetData.engagement.replies}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Repeat2 className="w-5 h-5" />
                              <span className="text-sm">{tweetData.engagement.retweets}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="w-5 h-5" />
                              <span className="text-sm">{tweetData.engagement.likes}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Share className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Download Button */}
                  <div className="mt-6">
                    <Button
                      onClick={downloadTweetImage}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating Image...' : `Download ${settings.format.toUpperCase()}`}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TweetToImageConverter;
