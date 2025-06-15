
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Copy, Instagram, Sparkles, Info, AlertCircle, Eye, Search, Download, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InstagramUser {
  pk: string;
  pk_id: string;
  full_name: string;
  username: string;
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  profile_pic_id: string;
  social_context?: string;
  search_social_context?: string;
  has_anonymous_profile_picture: boolean;
  fbid_v2?: number;
}

interface ProfileData {
  user: InstagramUser;
  profileUrl: string;
  highResProfilePic: string;
}

const InstagramProfileViewer = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const extractUsername = (input: string) => {
    const patterns = [
      /(?:instagram\.com\/|@)([a-zA-Z0-9._]+)/,
      /^([a-zA-Z0-9._]+)$/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1].replace(/[^a-zA-Z0-9._]/g, '');
      }
    }
    return null;
  };

  const getHighResProfilePic = (originalUrl: string) => {
    // Convert the URL to get higher resolution by removing size restrictions
    return originalUrl.replace(/s150x150/, 's320x320').replace(/s\d+x\d+/, 's320x320');
  };

  const fetchInstagramProfile = async (username: string) => {
    try {
      console.log('Fetching profile for username:', username);
      
      // Using CORS proxy to fetch Instagram data
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.instagram.com/web/search/topsearch/?query=${username}`)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Proxy response:', data);
      
      if (!data.contents) {
        throw new Error('No data received from proxy');
      }

      let instagramData;
      try {
        instagramData = JSON.parse(data.contents);
        console.log('Parsed Instagram data:', instagramData);
      } catch (parseError) {
        console.error('Failed to parse Instagram data:', parseError);
        throw new Error('Invalid response format');
      }

      // Check for Instagram API errors
      if (instagramData.status === 'fail') {
        if (instagramData.message && instagramData.message.includes('wait a few minutes')) {
          throw new Error('Instagram is rate limiting requests. Please try again in a few minutes.');
        }
        throw new Error(instagramData.message || 'Instagram API returned an error');
      }
      
      if (!instagramData.users || instagramData.users.length === 0) {
        throw new Error('Profile not found. Please check the username and try again.');
      }

      const user = instagramData.users[0].user;
      console.log('Found user:', user);
      
      return {
        user,
        profileUrl: `https://www.instagram.com/${user.username}/`,
        highResProfilePic: getHighResProfilePic(user.profile_pic_url)
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const handleViewProfile = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username or profile URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const cleanUsername = extractUsername(username.trim());
    
    if (!cleanUsername) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid Instagram username or profile URL",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchInstagramProfile(cleanUsername);
      setProfileData(data);
      
      toast({
        title: "Profile Found!",
        description: `Successfully loaded profile for @${data.user.username}`,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch profile. Please try again or check if the username exists.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInstagramProfile = () => {
    if (profileData) {
      window.open(profileData.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const copyProfileUrl = async () => {
    if (profileData) {
      try {
        await navigator.clipboard.writeText(profileData.profileUrl);
        toast({
          title: "Copied!",
          description: "Instagram profile URL copied to clipboard"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy URL",
          variant: "destructive"
        });
      }
    }
  };

  const downloadProfilePic = async () => {
    if (profileData) {
      try {
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = profileData.highResProfilePic;
        link.download = `${profileData.user.username}_profile_pic.jpg`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started!",
          description: "Profile picture download has been initiated"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to download profile picture",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleViewProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl shadow-lg">
              <Instagram className="h-10 w-10 text-pink-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Instagram Profile Viewer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            View Instagram profiles and access profile pictures. Get real profile data instantly.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              Find Instagram Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-base font-medium">Instagram Username or Profile URL</Label>
              <div className="flex gap-3">
                <Input
                  id="username"
                  type="text"
                  placeholder="@username or https://instagram.com/username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-base border-2 focus:border-pink-500 transition-all duration-200"
                />
                <Button 
                  onClick={handleViewProfile} 
                  disabled={isLoading}
                  className="h-12 px-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                >
                  {isLoading ? 'Searching...' : 'Find Profile'}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {error.includes('rate limiting') ? (
                    <Clock className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Supported formats:</p>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• https://instagram.com/username</li>
                      <li>• @username</li>
                      <li>• username</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900 mb-1">Features:</p>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• Real profile data</li>
                      <li>• High-quality profile pictures</li>
                      <li>• Direct Instagram access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {profileData && (
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg ring-4 ring-pink-200">
                    <AvatarImage 
                      src={profileData.highResProfilePic} 
                      alt={`${profileData.user.username}'s profile picture`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-100 to-purple-100">
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  {profileData.user.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {profileData.user.full_name || '@' + profileData.user.username}
              </CardTitle>
              <p className="text-lg text-gray-600 mb-2">@{profileData.user.username}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm mb-4">
                <span className={`px-3 py-1 rounded-full ${profileData.user.is_private ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                  {profileData.user.is_private ? 'Private Account' : 'Public Account'}
                </span>
                {profileData.user.is_verified && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    Verified
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  ID: {profileData.user.pk}
                </span>
              </div>
              
              {(profileData.user.social_context || profileData.user.search_social_context) && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 max-w-md mx-auto">
                  {profileData.user.social_context || profileData.user.search_social_context}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={openInstagramProfile}
                  className="h-14 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex flex-col gap-1"
                >
                  <Eye className="h-5 w-5" />
                  <span className="text-sm font-medium">View Profile</span>
                </Button>
                
                <Button
                  onClick={downloadProfilePic}
                  variant="outline"
                  className="h-14 border-2 hover:bg-gray-50 flex flex-col gap-1"
                >
                  <Download className="h-5 w-5" />
                  <span className="text-sm font-medium">Download Picture</span>
                </Button>
                
                <Button
                  onClick={copyProfileUrl}
                  variant="outline"
                  className="h-14 border-2 hover:bg-gray-50 flex flex-col gap-1"
                >
                  <Copy className="h-5 w-5" />
                  <span className="text-sm font-medium">Copy URL</span>
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ExternalLink className="h-4 w-4" />
                  <span>instagram.com/{profileData.user.username}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!profileData && !error && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/60 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-200 rounded-full mb-6 shadow-lg">
                <Instagram className="h-12 w-12 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Ready to Find Profile</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed mb-6">
                Enter an Instagram username or profile URL above to view the profile and access profile pictures.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg mx-auto flex items-center justify-center">
                    <Eye className="h-6 w-6 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-600">View Profile</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Download Picture</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                    <Copy className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Copy Links</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Real Data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstagramProfileViewer;
