
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Image, ExternalLink, Copy, Youtube, Sparkles, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const YouTubeThumbnailGrabber = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleExtract = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL or Video ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const id = extractVideoId(videoUrl.trim());
    if (!id) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL or Video ID",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    setVideoId(id);
    
    const thumbnailQualities = [
      { 
        name: 'Max Quality', 
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, 
        size: '1280x720',
        description: 'Best quality available',
        badge: 'Premium'
      },
      { 
        name: 'High Quality', 
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, 
        size: '480x360',
        description: 'Great for web use',
        badge: 'Recommended'
      },
      { 
        name: 'Standard Quality', 
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, 
        size: '640x480',
        description: 'Standard resolution',
        badge: null
      },
      { 
        name: 'Medium Quality', 
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, 
        size: '320x180',
        description: 'Compact size',
        badge: null
      },
      { 
        name: 'Thumbnail', 
        url: `https://img.youtube.com/vi/${id}/default.jpg`, 
        size: '120x90',
        description: 'Small preview',
        badge: null
      }
    ];

    setThumbnails(thumbnailQualities);
    setIsLoading(false);
    
    toast({
      title: "Success!",
      description: "Thumbnails extracted successfully!"
    });
  };

  const downloadThumbnail = async (url: string, quality: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `youtube-thumbnail-${videoId}-${quality.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Downloaded!",
        description: `${quality} thumbnail saved to your device`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download thumbnail",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Thumbnail URL copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive"
      });
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExtract();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Youtube className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              YouTube Thumbnail Grabber
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Extract high-quality thumbnails from any YouTube video instantly. Perfect for content creators, designers, and marketers.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-10 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              Extract Thumbnails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="video-url" className="text-lg font-medium">YouTube URL or Video ID</Label>
              <div className="flex gap-3">
                <Input
                  id="video-url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-lg border-2 focus:border-red-500 transition-all duration-200"
                />
                <Button 
                  onClick={handleExtract} 
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold"
                >
                  {isLoading ? 'Extracting...' : 'Extract'}
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 mb-2">Supported formats:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      https://www.youtube.com/watch?v=VIDEO_ID
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      https://youtu.be/VIDEO_ID
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      VIDEO_ID (11-character ID only)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {thumbnails.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Thumbnails</h2>
              <p className="text-gray-600">Choose your preferred quality and download instantly</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {thumbnails.map((thumbnail, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">{thumbnail.name}</CardTitle>
                      {thumbnail.badge && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          thumbnail.badge === 'Premium' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                            : 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                        }`}>
                          {thumbnail.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-mono text-gray-700">{thumbnail.size}</p>
                      <p className="text-sm text-gray-500">{thumbnail.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={thumbnail.url}
                        alt={`${thumbnail.name} thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzYgNzJMMTc2IDk2TDEzNiAxMjBWNzJaIiBmaWxsPSIjOUM5Qzk5Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUM5Qzk5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=';
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => downloadThumbnail(thumbnail.url, thumbnail.name)}
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Image
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(thumbnail.url)}
                          className="flex-1 h-10 border-2 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy URL
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => openInNewTab(thumbnail.url)}
                          className="flex-1 h-10 border-2 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {thumbnails.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6">
                <Image className="h-16 w-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Ready to Extract Thumbnails</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed">
                Enter a YouTube URL or Video ID above and click "Extract" to get high-quality thumbnails in multiple resolutions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default YouTubeThumbnailGrabber;
