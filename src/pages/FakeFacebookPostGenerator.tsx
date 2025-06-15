
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Share, ThumbsUp, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const FakeFacebookPostGenerator = () => {
  const { toast } = useToast();
  const [profileName, setProfileName] = useState('John Doe');
  const [profileImage, setProfileImage] = useState('');
  const [postContent, setPostContent] = useState('Just had an amazing day! 🌟');
  const [timestamp, setTimestamp] = useState('2h');
  const [likes, setLikes] = useState('42');
  const [comments, setComments] = useState('8');
  const [shares, setShares] = useState('3');
  const [isVerified, setIsVerified] = useState(false);

  const downloadPost = async () => {
    const element = document.getElementById('facebook-post');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const link = document.createElement('a');
        link.download = 'facebook-post.png';
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Success!",
          description: "Facebook post downloaded successfully.",
        });
      } catch (error) {
        console.error('Error generating image:', error);
        toast({
          title: "Error",
          description: "Failed to download the post. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Fake Facebook Post Generator</h1>
        <p className="text-muted-foreground">
          Create realistic-looking Facebook posts for entertainment purposes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profileName">Profile Name</Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
              />
            </div>

            <div>
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input
                id="profileImage"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>

            <div>
              <Label htmlFor="postContent">Post Content</Label>
              <Textarea
                id="postContent"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input
                  id="timestamp"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="2h"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="verified"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="verified">Verified Badge</Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="42"
                />
              </div>
              <div>
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="8"
                />
              </div>
              <div>
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>

            <Button onClick={downloadPost} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Post
            </Button>
          </CardContent>
        </Card>

        {/* Facebook Post Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              id="facebook-post"
              className="bg-white rounded-lg shadow-sm border max-w-[500px] mx-auto"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {/* Post Header */}
              <div className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profileImage} alt={profileName} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                      {profileName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {profileName}
                      </span>
                      {isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>{timestamp}</span>
                      <span>·</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-3 pb-3">
                <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                  {postContent}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="px-3 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-2 h-2 text-white" />
                      </div>
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-2 h-2 text-white fill-current" />
                      </div>
                    </div>
                    <span>{likes}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>{comments} comments</span>
                    <span>{shares} shares</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100">
                <div className="flex">
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50">
                    <Share className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FakeFacebookPostGenerator;
