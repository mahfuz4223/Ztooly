
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
import { Heart, MessageCircle, Share, ThumbsUp, Download, Globe, Users, Lock, Camera, Smile } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const FakeFacebookPostGenerator = () => {
  const { toast } = useToast();
  const [profileName, setProfileName] = useState('John Doe');
  const [profileImage, setProfileImage] = useState('');
  const [postContent, setPostContent] = useState('Just had an amazing day! 🌟');
  const [timestamp, setTimestamp] = useState('21h');
  const [likes, setLikes] = useState('420');
  const [comments, setComments] = useState('800');
  const [shares, setShares] = useState('30');
  const [isVerified, setIsVerified] = useState(true);
  const [privacy, setPrivacy] = useState('public');
  const [postImage, setPostImage] = useState('');

  const postTemplates = [
    "Just had an amazing day! 🌟",
    "Feeling blessed and grateful today ❤️",
    "Weekend vibes are hitting different 🎉",
    "Coffee and good friends make everything better ☕",
    "Sometimes you just need to appreciate the little things ✨",
    "New adventures await! Who's ready? 🚀"
  ];

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😴', '🎉', '🌟', '❤️', '👍', '🔥', '✨', '🚀', '☕', '🌈'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'post') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfileImage(result);
        } else {
          setPostImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmojiToPost = (emoji: string) => {
    setPostContent(prev => prev + emoji);
  };

  const useTemplate = (template: string) => {
    setPostContent(template);
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case 'public': return <Globe className="w-3 h-3" />;
      case 'friends': return <Users className="w-3 h-3" />;
      case 'private': return <Lock className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const downloadPost = async () => {
    const element = document.getElementById('facebook-post');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false,
          height: element.scrollHeight,
          width: element.scrollWidth,
        });
        
        const link = document.createElement('a');
        link.download = `facebook-post-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Fake Facebook Post Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Create realistic-looking Facebook posts with advanced customization
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Profile Settings
              </CardTitle>
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
                <Label htmlFor="profileImageUpload">Profile Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="profileImage"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="Enter image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('profileImageUpload')?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="verified">Verified Badge</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="privacy">Privacy:</Label>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Post Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {postTemplates.slice(0, 3).map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template)}
                      className="text-left justify-start text-xs"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="postContent">Post Text</Label>
                <Textarea
                  id="postContent"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                />
              </div>

              <div>
                <Label>Add Emojis</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addEmojiToPost(emoji)}
                      className="text-lg p-1 h-8 w-8"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="postImageUpload">Post Image (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="postImageUrl"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="Enter image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('postImageUpload')?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="postImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'post')}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Engagement Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timestamp">Posted</Label>
                  <Input
                    id="timestamp"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="21h"
                  />
                </div>
                <div>
                  <Label htmlFor="likes">Likes</Label>
                  <Input
                    id="likes"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    placeholder="420"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Input
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="800"
                  />
                </div>
                <div>
                  <Label htmlFor="shares">Shares</Label>
                  <Input
                    id="shares"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>

              <Button onClick={downloadPost} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download High Quality PNG
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Facebook Post Preview */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div
                id="facebook-post"
                className="bg-white rounded-lg shadow-md border max-w-[500px] mx-auto overflow-hidden"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={profileImage} alt={profileName} />
                      <AvatarFallback className="bg-blue-500 text-white text-sm font-semibold">
                        {profileName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold text-[15px] text-gray-900">
                          {profileName}
                        </span>
                        {isVerified && (
                          <div className="w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-[10px] h-[10px] text-white fill-current" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-[13px] text-gray-500 flex items-center space-x-1">
                        <span>{timestamp}</span>
                        <span>·</span>
                        {getPrivacyIcon()}
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
                <div className="px-4 pb-3">
                  <p className="text-gray-900 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {postContent}
                  </p>
                </div>

                {/* Post Image */}
                {postImage && (
                  <div className="mb-3">
                    <img
                      src={postImage}
                      alt="Post content"
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-[13px] text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="flex -space-x-1">
                        <div className="w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <ThumbsUp className="w-[10px] h-[10px] text-white fill-current" />
                        </div>
                        <div className="w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Heart className="w-[10px] h-[10px] text-white fill-current" />
                        </div>
                      </div>
                      <span className="ml-2">{likes}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>{comments} comments</span>
                      <span>{shares} shares</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200">
                  <div className="flex">
                    <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition-colors">
                      <ThumbsUp className="w-[18px] h-[18px] mr-2" />
                      <span className="text-[15px] font-medium">Like</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-[18px] h-[18px] mr-2" />
                      <span className="text-[15px] font-medium">Comment</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Share className="w-[18px] h-[18px] mr-2" />
                      <span className="text-[15px] font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FakeFacebookPostGenerator;
