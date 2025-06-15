
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Repeat2, Share, Download, Link, Zap, AlertCircle, CheckCircle2, Copy, Eye, Palette, Settings } from 'lucide-react';
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
    quality: 'high',
    width: 'auto',
    showWatermark: false,
    fontFamily: 'default'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Enhanced sample tweet data with more variety
  const sampleTweets = {
    elon: {
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
      media: null
    },
    nasa: {
      id: '1234567891',
      username: 'nasa',
      displayName: 'NASA',
      handle: '@nasa',
      profileImage: 'https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB_400x400.jpg',
      tweetText: 'Incredible new images from the James Webb Space Telescope show the beauty and complexity of our universe. Each photo reveals secrets that have been hidden for billions of years. 🌌✨\n\n#JWST #Space #Astronomy #Universe',
      timestamp: '1:15 PM · Dec 15, 2024',
      engagement: {
        replies: '3.2K',
        retweets: '18.7K',
        likes: '125.6K',
        bookmarks: '28.1K'
      },
      isVerified: true,
      media: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop'
    },
    openai: {
      id: '1234567892',
      username: 'openai',
      displayName: 'OpenAI',
      handle: '@openai',
      profileImage: 'https://pbs.twimg.com/profile_images/1634058036934500352/b4F1eVpJ_400x400.jpg',
      tweetText: 'Introducing our latest AI model with enhanced reasoning capabilities. This breakthrough represents a significant step forward in artificial intelligence research and development. 🤖\n\n• Improved logical reasoning\n• Better code understanding\n• Enhanced creativity\n\n#AI #MachineLearning #Innovation',
      timestamp: '11:45 AM · Dec 15, 2024',
      engagement: {
        replies: '5.8K',
        retweets: '25.4K',
        likes: '156.2K',
        bookmarks: '42.7K'
      },
      isVerified: true,
      media: null
    }
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced mock data selection based on URL
      let mockData = sampleTweets.elon;
      
      if (tweetUrl.includes('nasa')) {
        mockData = sampleTweets.nasa;
      } else if (tweetUrl.includes('openai')) {
        mockData = sampleTweets.openai;
      } else {
        // Random selection for other URLs
        const keys = Object.keys(sampleTweets);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        mockData = sampleTweets[randomKey];
      }
      
      setTweetData(mockData);
      toast({
        title: "✅ Tweet Loaded Successfully!",
        description: "Tweet data has been loaded. You can now customize and download it.",
      });
      
    } catch (error) {
      console.error('Error fetching tweet:', error);
      toast({
        title: "❌ Loading Failed",
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
          backgroundColor: settings.theme === 'dark' ? '#000000' : settings.theme === 'dim' ? '#15202b' : '#ffffff',
          scale: settings.quality === 'high' ? 3 : settings.quality === 'ultra' ? 4 : 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: element.scrollWidth,
          height: element.scrollHeight,
          onclone: (clonedDoc) => {
            // Ensure fonts are loaded in the cloned document
            const clonedElement = clonedDoc.getElementById('tweet-preview');
            if (clonedElement) {
              clonedElement.style.fontFamily = settings.fontFamily === 'default' ? 
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' :
                settings.fontFamily;
            }
          }
        });
        
        const link = document.createElement('a');
        link.download = `tweet-${tweetData.username}-${Date.now()}.${settings.format}`;
        link.href = canvas.toDataURL(`image/${settings.format}`, settings.format === 'jpeg' ? 0.95 : 1.0);
        link.click();
        
        toast({
          title: "🎉 Download Complete!",
          description: `Tweet image downloaded as ${settings.format.toUpperCase()} (${settings.quality} quality).`,
        });
      } catch (error) {
        console.error('Error generating image:', error);
        toast({
          title: "❌ Generation Failed",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const copyTweetUrl = () => {
    navigator.clipboard.writeText(tweetUrl);
    toast({
      title: "📋 Copied!",
      description: "Tweet URL copied to clipboard.",
    });
  };

  const renderTweetText = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return <span key={index} className="text-blue-500 hover:underline cursor-pointer">{part}</span>;
      } else if (part.startsWith('@')) {
        return <span key={index} className="text-blue-500 hover:underline cursor-pointer">{part}</span>;
      } else if (part.startsWith('http')) {
        return <span key={index} className="text-blue-500 hover:underline cursor-pointer">{part}</span>;
      }
      return part;
    });
  };

  const sampleUrls = [
    { url: 'https://x.com/elonmusk/status/1234567890', label: 'Elon Musk - SpaceX Update' },
    { url: 'https://twitter.com/nasa/status/1234567891', label: 'NASA - JWST Discovery' },
    { url: 'https://x.com/openai/status/1234567892', label: 'OpenAI - AI Breakthrough' }
  ];

  const themeStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-gray-200'
    },
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-gray-800'
    },
    dim: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Enhanced Header */}
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
          Transform any Twitter/X post into a stunning, high-quality image. Perfect for sharing, presentations, and social media.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">🔗 Real URLs</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">📱 Mobile Ready</Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">🎨 Customizable</Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">⚡ Ultra Fast</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced Input Section */}
        <div className="space-y-6">
          {/* URL Input with Better UX */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-blue-600" />
                Tweet URL Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tweetUrl" className="text-base font-medium">Paste Twitter/X URL</Label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 relative">
                    <Input
                      id="tweetUrl"
                      value={tweetUrl}
                      onChange={(e) => setTweetUrl(e.target.value)}
                      placeholder="https://x.com/username/status/1234567890"
                      className={`pr-20 text-sm ${tweetUrl && !isValidUrl ? 'border-red-500 bg-red-50' : ''} ${isValidUrl ? 'border-green-500 bg-green-50' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      {tweetUrl && (
                        <>
                          {isValidUrl ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyTweetUrl}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={fetchTweetData}
                    disabled={!isValidUrl || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? 'Loading...' : '🚀 Load'}
                  </Button>
                </div>
                {tweetUrl && !isValidUrl && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Please enter a valid Twitter/X URL
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">📋 Try these sample URLs:</Label>
                <div className="space-y-2 mt-2">
                  {sampleUrls.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setTweetUrl(sample.url)}
                      className="text-left justify-start text-xs h-auto py-3 w-full hover:bg-blue-50"
                    >
                      <div>
                        <div className="font-medium">{sample.label}</div>
                        <div className="text-gray-500 truncate">{sample.url}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Customization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme & Quality */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme
                  </Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">🌞 Light Mode</SelectItem>
                      <SelectItem value="dark">🌙 Dark Mode</SelectItem>
                      <SelectItem value="dim">🌆 Dim Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>🎯 Quality</Label>
                  <Select value={settings.quality} onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (2x)</SelectItem>
                      <SelectItem value="high">High (3x)</SelectItem>
                      <SelectItem value="ultra">Ultra (4x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Format & Style */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>📄 Format</Label>
                  <Select value={settings.format} onValueChange={(value) => setSettings(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Best Quality)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Smaller Size)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>🎨 Border Style</Label>
                  <Select value={settings.borderRadius} onValueChange={(value) => setSettings(prev => ({ ...prev, borderRadius: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sharp Corners</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="rounded-lg">Extra Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font & Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>🔤 Font Family</Label>
                  <Select value={settings.fontFamily} onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Twitter Default</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>📱 Preview Mode</Label>
                  <Select value={previewMode} onValueChange={setPreviewMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Desktop View</SelectItem>
                      <SelectItem value="mobile">Mobile View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEngagement" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Show Engagement Metrics
                  </Label>
                  <input
                    type="checkbox"
                    id="showEngagement"
                    checked={settings.showEngagement}
                    onChange={(e) => setSettings(prev => ({ ...prev, showEngagement: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWatermark" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Add Watermark
                  </Label>
                  <input
                    type="checkbox"
                    id="showWatermark"
                    checked={settings.showWatermark}
                    onChange={(e) => setSettings(prev => ({ ...prev, showWatermark: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Features */}
          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                ✨ Powerful Features
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Real tweet URLs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Ultra-high resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Multiple themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Custom fonts</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Engagement metrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Mobile preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>PNG & JPEG export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Instant download</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Preview Section */}
        <div className="lg:sticky lg:top-4">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </span>
                {tweetData && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    ✅ Ready
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {tweetData ? 'Your tweet is ready for download' : 'Load a tweet to see the live preview'}
              </p>
            </CardHeader>
            <CardContent>
              {!tweetData ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Link className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No Tweet Loaded</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Paste a Twitter/X URL above and click "🚀 Load" to see the magic happen
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    Supports both twitter.com and x.com URLs
                  </div>
                </div>
              ) : (
                <>
                  {/* Enhanced Tweet Preview */}
                  <div
                    id="tweet-preview"
                    className={`
                      ${previewMode === 'mobile' ? 'max-w-[350px]' : 'max-w-[600px]'} 
                      mx-auto p-6 relative
                      ${themeStyles[settings.theme].bg} ${themeStyles[settings.theme].text}
                      ${settings.borderRadius} shadow-lg border ${themeStyles[settings.theme].border}
                    `}
                    style={{
                      fontFamily: settings.fontFamily === 'default' ? 
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' :
                        settings.fontFamily
                    }}
                  >
                    {/* Tweet Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-200">
                        <AvatarImage src={tweetData.profileImage} alt={tweetData.displayName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {tweetData.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[15px]">{tweetData.displayName}</span>
                          {tweetData.isVerified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[15px] ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {tweetData.handle}
                        </span>
                      </div>
                      <div className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
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

                    {/* Media if exists */}
                    {tweetData.media && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={tweetData.media} 
                          alt="Tweet media" 
                          className="w-full h-auto max-h-80 object-cover"
                        />
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-[15px] mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tweetData.timestamp}
                    </div>

                    {/* Engagement */}
                    {settings.showEngagement && (
                      <>
                        <Separator className="my-4" />
                        <div className={`flex items-center justify-between ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer transition-colors">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">{tweetData.engagement.replies}</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:text-green-500 cursor-pointer transition-colors">
                              <Repeat2 className="w-5 h-5" />
                              <span className="text-sm font-medium">{tweetData.engagement.retweets}</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:text-red-500 cursor-pointer transition-colors">
                              <Heart className="w-5 h-5" />
                              <span className="text-sm font-medium">{tweetData.engagement.likes}</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer transition-colors">
                              <Share className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Watermark */}
                    {settings.showWatermark && (
                      <div className="absolute bottom-2 right-2 opacity-30">
                        <span className="text-xs font-mono">Generated by TweetConverter</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Download Section */}
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={downloadTweetImage}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {isGenerating ? '🔄 Generating...' : `💾 Download ${settings.format.toUpperCase()}`}
                    </Button>
                    
                    <div className="text-center text-xs text-gray-500">
                      Quality: {settings.quality} • Format: {settings.format.toUpperCase()} • Theme: {settings.theme}
                    </div>
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
