
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Tag, Youtube, Search, Loader2 } from 'lucide-react';

interface VideoData {
  title: string;
  tags: string[];
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
}

const YouTubeTagExtractor = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const fetchVideoData = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Note: In a real application, you'd need a YouTube API key and make the request through a backend
      // This is a mock implementation showing the structure
      
      // Mock data for demonstration - replace with actual API call
      setTimeout(() => {
        const mockData: VideoData = {
          title: "Sample YouTube Video Title",
          tags: [
            "youtube", "tutorial", "web development", "javascript", "react", 
            "programming", "coding", "tech", "educational", "beginners",
            "frontend", "backend", "full stack", "software engineering"
          ],
          description: "This is a sample video description that would contain the actual video description from YouTube.",
          channelTitle: "Sample Channel",
          publishedAt: "2024-01-15",
          viewCount: "10,500",
          likeCount: "850",
          duration: "15:30"
        };
        
        setVideoData(mockData);
        setLoading(false);
        toast({
          title: "Success!",
          description: "Video tags extracted successfully",
        });
      }, 2000);
      
    } catch (err) {
      setError('Failed to extract video data. Please try again.');
      setLoading(false);
    }
  };

  const copyTags = () => {
    if (videoData?.tags) {
      const tagsText = videoData.tags.join(', ');
      navigator.clipboard.writeText(tagsText);
      toast({
        title: "Copied!",
        description: "Tags copied to clipboard",
      });
    }
  };

  const downloadTags = () => {
    if (videoData?.tags) {
      const content = `Video Title: ${videoData.title}\nChannel: ${videoData.channelTitle}\nTags: ${videoData.tags.join(', ')}\n\nDescription:\n${videoData.description}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'youtube-tags.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Tags saved as text file",
      });
    }
  };

  const resetForm = () => {
    setUrl('');
    setVideoData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Youtube className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">YouTube Tag Extractor</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract tags, title, and metadata from any YouTube video. Perfect for content creators, marketers, and researchers.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Extract Video Tags
            </CardTitle>
            <CardDescription>
              Enter a YouTube video URL to extract its tags and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-base"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                onClick={fetchVideoData} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Tag className="h-4 w-4 mr-2" />
                    Extract Tags
                  </>
                )}
              </Button>
              
              {videoData && (
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {videoData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Video Information</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyTags}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Tags
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadTags}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-lg font-semibold">{videoData.title}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-700">Channel</Label>
                    <p className="font-medium">{videoData.channelTitle}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Views</Label>
                    <p className="font-medium">{videoData.viewCount}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Likes</Label>
                    <p className="font-medium">{videoData.likeCount}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Duration</Label>
                    <p className="font-medium">{videoData.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags ({videoData.tags.length})</CardTitle>
                <CardDescription>
                  Video tags that can be used for SEO and content discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {videoData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags-textarea">Tags as Text (comma-separated)</Label>
                  <Textarea
                    id="tags-textarea"
                    value={videoData.tags.join(', ')}
                    readOnly
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={videoData.description}
                  readOnly
                  rows={6}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Supported URL Formats:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>• https://youtu.be/VIDEO_ID</li>
                  <li>• https://www.youtube.com/embed/VIDEO_ID</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Extract video tags and metadata</li>
                  <li>• Copy tags to clipboard</li>
                  <li>• Download as text file</li>
                  <li>• View video statistics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YouTubeTagExtractor;
