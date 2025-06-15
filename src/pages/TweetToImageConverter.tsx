
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Repeat2, Share, Download, Upload, Palette, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const TweetToImageConverter = () => {
  const { toast } = useToast();
  
  const [tweetData, setTweetData] = useState({
    username: 'johndoe',
    displayName: 'John Doe',
    handle: '@johndoe',
    profileImage: '',
    tweetText: 'Just discovered an amazing new tool! This Tweet to Image converter makes creating beautiful tweet graphics so easy. Perfect for social media content! 🚀 #TweetDesign #SocialMedia',
    timestamp: '2:34 PM · Dec 15, 2024',
    engagement: {
      replies: '142',
      retweets: '1.2K',
      likes: '5.8K',
      bookmarks: '234'
    },
    isVerified: true
  });

  const [settings, setSettings] = useState({
    theme: 'light',
    borderRadius: 'rounded',
    padding: 'normal',
    showEngagement: true,
    fontFamily: 'system',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updateTweetData = (field: string, value: any) => {
    setTweetData(prev => ({ ...prev, [field]: value }));
  };

  const updateEngagement = (field: string, value: string) => {
    setTweetData(prev => ({
      ...prev,
      engagement: { ...prev.engagement, [field]: value }
    }));
  };

  const updateSettings = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateTweetData('profileImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomEngagement = () => {
    const replies = Math.floor(Math.random() * 1000) + 50;
    const retweets = Math.floor(Math.random() * 5000) + 100;
    const likes = Math.floor(Math.random() * 10000) + 500;
    const bookmarks = Math.floor(Math.random() * 500) + 20;

    setTweetData(prev => ({
      ...prev,
      engagement: {
        replies: formatNumber(replies),
        retweets: formatNumber(retweets),
        likes: formatNumber(likes),
        bookmarks: formatNumber(bookmarks)
      }
    }));

    toast({
      title: "Engagement Updated",
      description: "Random engagement numbers generated successfully!",
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const downloadTweetImage = async () => {
    setIsGenerating(true);
    const element = document.getElementById('tweet-preview');
    
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: settings.backgroundColor,
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `tweet-image-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        toast({
          title: "Success!",
          description: "Tweet image downloaded successfully.",
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

  const renderTweetText = (text: string) => {
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

  const presetTemplates = [
    "Just discovered something amazing! This new tool is a game-changer for content creators. 🚀 #Innovation #ContentCreation",
    "Working on exciting new projects! Sometimes the best ideas come when you least expect them. ✨ #Inspiration #Creativity",
    "The future is bright! Technology continues to amaze me every single day. What's your favorite recent innovation? 🌟 #Technology #Future",
    "Coffee, code, and creativity - the perfect combination for productivity! ☕ #WorkLife #Productivity #Developer"
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
          Transform your tweets into stunning, shareable images with professional styling and customization options
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">High Quality</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">Real-time Preview</Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">Customizable</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">👤</AvatarFallback>
                </Avatar>
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={tweetData.displayName}
                    onChange={(e) => updateTweetData('displayName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={tweetData.username}
                    onChange={(e) => updateTweetData('username', e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profileImageUpload">Profile Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={tweetData.profileImage}
                    onChange={(e) => updateTweetData('profileImage', e.target.value)}
                    placeholder="Enter image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('profileImageUpload')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={tweetData.isVerified}
                    onChange={(e) => updateTweetData('isVerified', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="verified">Verified Badge</Label>
                </div>
                <Badge variant={tweetData.isVerified ? "default" : "outline"}>
                  {tweetData.isVerified ? "✓ Verified" : "Not Verified"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tweet Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Tweet Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {presetTemplates.slice(0, 2).map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => updateTweetData('tweetText', template)}
                      className="text-left justify-start text-xs h-auto py-2"
                    >
                      {template.slice(0, 60)}...
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tweetText">Tweet Text</Label>
                <Textarea
                  id="tweetText"
                  value={tweetData.tweetText}
                  onChange={(e) => updateTweetData('tweetText', e.target.value)}
                  placeholder="What's happening?"
                  rows={4}
                  maxLength={280}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {tweetData.tweetText.length}/280 characters
                  </span>
                  <Badge variant={tweetData.tweetText.length > 280 ? "destructive" : "outline"}>
                    {280 - tweetData.tweetText.length} remaining
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input
                  id="timestamp"
                  value={tweetData.timestamp}
                  onChange={(e) => updateTweetData('timestamp', e.target.value)}
                  placeholder="2:34 PM · Dec 15, 2024"
                />
              </div>
            </CardContent>
          </Card>

          {/* Engagement Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="replies">Replies</Label>
                  <Input
                    id="replies"
                    value={tweetData.engagement.replies}
                    onChange={(e) => updateEngagement('replies', e.target.value)}
                    placeholder="142"
                  />
                </div>
                <div>
                  <Label htmlFor="retweets">Retweets</Label>
                  <Input
                    id="retweets"
                    value={tweetData.engagement.retweets}
                    onChange={(e) => updateEngagement('retweets', e.target.value)}
                    placeholder="1.2K"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="likes">Likes</Label>
                  <Input
                    id="likes"
                    value={tweetData.engagement.likes}
                    onChange={(e) => updateEngagement('likes', e.target.value)}
                    placeholder="5.8K"
                  />
                </div>
                <div>
                  <Label htmlFor="bookmarks">Bookmarks</Label>
                  <Input
                    id="bookmarks"
                    value={tweetData.engagement.bookmarks}
                    onChange={(e) => updateEngagement('bookmarks', e.target.value)}
                    placeholder="234"
                  />
                </div>
              </div>

              <Button onClick={generateRandomEngagement} variant="outline" className="w-full">
                🎲 Generate Random Metrics
              </Button>
            </CardContent>
          </Card>

          {/* Style Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Style Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSettings('theme', value)}>
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
                  <Label>Border Style</Label>
                  <Select value={settings.borderRadius} onValueChange={(value) => updateSettings('borderRadius', value)}>
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
                  onChange={(e) => updateSettings('showEngagement', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="showEngagement">Show Engagement Metrics</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                See how your tweet will look as an image
              </p>
            </CardHeader>
            <CardContent>
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
                    <span className="text-gray-500 text-[15px]">@{tweetData.username}</span>
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
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{tweetData.engagement.replies}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                          <Repeat2 className="w-5 h-5" />
                          <span className="text-sm">{tweetData.engagement.retweets}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{tweetData.engagement.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                          <Share className="w-5 h-5" />
                        </button>
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
                  {isGenerating ? 'Generating Image...' : 'Download High Quality PNG'}
                </Button>
              </div>

              {/* Features List */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">✨ Features Included:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-resolution 3x scaling</li>
                  <li>• Real-time preview updates</li>
                  <li>• Custom engagement metrics</li>
                  <li>• Multiple theme options</li>
                  <li>• Profile image upload support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TweetToImageConverter;
