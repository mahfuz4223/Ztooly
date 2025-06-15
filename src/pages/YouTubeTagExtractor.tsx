import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Tag, Youtube, Search, Loader2, ExternalLink, Image } from 'lucide-react';
import { YouTubeService } from '@/services/youtubeService';

interface VideoData {
  title: string;
  tags: string[];
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  thumbnailUrl: string;
  videoId: string;
}

const YouTubeTagExtractor = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchVideoData = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching video data for URL:', url);
      const data = await YouTubeService.fetchVideoData(url);
      console.log('Video data fetched successfully:', data);
      
      setVideoData(data);
      toast({
        title: "Success!",
        description: "Video data extracted successfully",
      });
    } catch (err) {
      console.error('Error fetching video data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract video data. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
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

  const copyTitle = () => {
    if (videoData?.title) {
      navigator.clipboard.writeText(videoData.title);
      toast({
        title: "Copied!",
        description: "Title copied to clipboard",
      });
    }
  };

  const copyDescription = () => {
    if (videoData?.description) {
      navigator.clipboard.writeText(videoData.description);
      toast({
        title: "Copied!",
        description: "Description copied to clipboard",
      });
    }
  };

  const downloadTags = () => {
    if (videoData?.tags) {
      const content = `Video Title: ${videoData.title}
Channel: ${videoData.channelTitle}
Published: ${videoData.publishedAt}
Views: ${videoData.viewCount}
Duration: ${videoData.duration}
URL: https://www.youtube.com/watch?v=${videoData.videoId}

Tags: ${videoData.tags.join(', ')}

Description:
${videoData.description}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-tags-${videoData.videoId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Video data saved as text file",
      });
    }
  };

  const openVideoInNewTab = () => {
    if (videoData?.videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoData.videoId}`, '_blank');
    }
  };

  const resetForm = () => {
    setUrl('');
    setVideoData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-1 sm:p-3 md:p-4">
      <div className="container mx-auto max-w-2xl md:max-w-5xl px-1 sm:px-3 md:px-0">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-red-100 rounded-full">
              <Youtube className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">YouTube Tag Extractor</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Extract real tags, metadata, and information from any YouTube video. Perfect for content creators, marketers, and researchers.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Search className="h-5 w-5" />
              Extract Video Data
            </CardTitle>
            <CardDescription>
              Enter a YouTube video URL to extract its tags, title, description, and metadata
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
                onKeyDown={(e) => e.key === 'Enter' && fetchVideoData()}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={fetchVideoData} 
                disabled={loading || !url.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting Data...
                  </>
                ) : (
                  <>
                    <Tag className="h-4 w-4 mr-2" />
                    Extract Video Data
                  </>
                )}
              </Button>
              {videoData && (
                <Button variant="outline" onClick={resetForm} className="flex-1 sm:flex-initial">
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {videoData && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Video Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videoData.thumbnailUrl && (
                    <div className="space-y-3">
                      <img 
                        src={videoData.thumbnailUrl} 
                        alt="Video thumbnail" 
                        className="w-full rounded-lg shadow-md"
                        style={{ maxHeight: 220, objectFit: 'cover' }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={openVideoInNewTab}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open on YouTube
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>Video Information</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyTitle}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Title
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadTags}>
                        <Download className="h-4 w-4 mr-1" />
                        Download All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Title</Label>
                    <p className="text-base sm:text-lg font-semibold break-words">{videoData.title}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <Label className="text-gray-700">Channel</Label>
                      <p className="font-medium truncate" title={videoData.channelTitle}>{videoData.channelTitle}</p>
                    </div>
                    <div>
                      <Label className="text-gray-700">Views</Label>
                      <p className="font-medium">
                        {videoData.viewCount !== "Unknown" ? videoData.viewCount : <span className="text-gray-400 italic">Unavailable</span>}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700">Published</Label>
                      <p className="font-medium">
                        {videoData.publishedAt !== "Unknown" ? videoData.publishedAt : <span className="text-gray-400 italic">Unavailable</span>}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-700">Duration</Label>
                      <p className="font-medium">
                        {videoData.duration !== "Unknown" ? videoData.duration : <span className="text-gray-400 italic">Unavailable</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tags ({videoData.tags.length})</span>
                  <Button size="sm" variant="outline" onClick={copyTags}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Tags
                  </Button>
                </CardTitle>
                <CardDescription>
                  Video tags that can be used for SEO and content discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                {videoData.tags.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {videoData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="tags-textarea">Tags as Text (comma-separated)</Label>
                      <Textarea
                        id="tags-textarea"
                        value={videoData.tags.join(', ')}
                        readOnly
                        rows={2}
                        className="resize-none text-xs sm:text-base"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 sm:py-8 text-gray-500">
                    <Tag className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                    <p>No tags found for this video</p>
                    <p className="text-xs sm:text-sm">This might be due to privacy settings or the video being unlisted</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Video Description</span>
                  <Button size="sm" variant="outline" onClick={copyDescription}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Description
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={videoData.description && videoData.description !== "Unknown" ? videoData.description : "No description available"}
                  readOnly
                  rows={6}
                  className="resize-none text-xs sm:text-base"
                  placeholder="No description available"
                />
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Supported URL Formats:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>• https://youtu.be/VIDEO_ID</li>
                  <li>• https://www.youtube.com/embed/VIDEO_ID</li>
                  <li>• Mobile YouTube links</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What You Get:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real video tags and metadata</li>
                  <li>• Video thumbnail preview</li>
                  <li>• Title, description, and channel info</li>
                  <li>• View count and publish date</li>
                  <li>• Copy and download functionality</li>
                  <li>• Direct links to YouTube</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This tool extracts publicly available information. Some data might be limited for private or restricted videos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YouTubeTagExtractor;
