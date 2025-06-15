
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Image, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const YouTubeThumbnailGrabber = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnails, setThumbnails] = useState<any[]>([]);
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

    const id = extractVideoId(videoUrl.trim());
    if (!id) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL or Video ID",
        variant: "destructive"
      });
      return;
    }

    setVideoId(id);
    
    const thumbnailQualities = [
      { name: 'Max Quality', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, size: '1280x720' },
      { name: 'High Quality', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, size: '480x360' },
      { name: 'Medium Quality', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, size: '320x180' },
      { name: 'Standard Quality', url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, size: '640x480' },
      { name: 'Default', url: `https://img.youtube.com/vi/${id}/default.jpg`, size: '120x90' }
    ];

    setThumbnails(thumbnailQualities);
    
    toast({
      title: "Success",
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
        title: "Downloaded",
        description: `${quality} thumbnail downloaded successfully!`
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
        title: "Copied",
        description: "Thumbnail URL copied to clipboard!"
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          YouTube Thumbnail Grabber
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Extract high-quality thumbnails from any YouTube video. Enter a YouTube URL or Video ID to get started.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Extract Thumbnails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url">YouTube URL or Video ID</Label>
            <div className="flex gap-2">
              <Input
                id="video-url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleExtract} className="bg-red-600 hover:bg-red-700">
                Extract
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Supported formats:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://youtube.com/embed/VIDEO_ID</li>
              <li>VIDEO_ID (just the 11-character ID)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {thumbnails.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Available Thumbnails</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thumbnails.map((thumbnail, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{thumbnail.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{thumbnail.size}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt={`${thumbnail.name} thumbnail`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzYgNzJMMTc2IDk2TDEzNiAxMjBWNzJaIiBmaWxsPSIjOUM5Qzk5Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUM5Qzk5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=';
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadThumbnail(thumbnail.url, thumbnail.name)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(thumbnail.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInNewTab(thumbnail.url)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {thumbnails.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No thumbnails extracted yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter a YouTube URL or Video ID above and click "Extract" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeThumbnailGrabber;
