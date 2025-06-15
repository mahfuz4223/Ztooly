
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, User, ExternalLink, Copy, Instagram, Sparkles, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstagramProfileViewer = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractUsername = (input: string) => {
    // Remove Instagram URL and extract username
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
      // Note: This is a demo implementation. In a real app, you'd need a backend service
      // to fetch Instagram data due to CORS and API restrictions
      const mockProfileData = {
        username: cleanUsername,
        fullName: `${cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)} User`,
        profilePicUrl: `https://via.placeholder.com/400x400/e11d48/white?text=${cleanUsername.charAt(0).toUpperCase()}`,
        profilePicUrlHD: `https://via.placeholder.com/1080x1080/e11d48/white?text=${cleanUsername.charAt(0).toUpperCase()}`,
        isPrivate: false,
        followerCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        postCount: Math.floor(Math.random() * 500)
      };

      setProfileData(mockProfileData);
      
      toast({
        title: "Success!",
        description: "Profile data loaded successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Downloaded!",
        description: "Profile picture saved to your device"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard"
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
      handleViewProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl">
              <Instagram className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Instagram Profile Viewer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View and download Instagram profile pictures in high definition quality. Perfect for viewing public profiles and saving profile images.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-10 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              View Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-lg font-medium">Instagram Username or Profile URL</Label>
              <div className="flex gap-3">
                <Input
                  id="username"
                  type="text"
                  placeholder="@username or https://instagram.com/username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-lg border-2 focus:border-pink-500 transition-all duration-200"
                />
                <Button 
                  onClick={handleViewProfile} 
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                >
                  {isLoading ? 'Loading...' : 'View Profile'}
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
                      https://instagram.com/username
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      @username
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      username (without @)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-900 mb-2">Important Note:</p>
                  <p className="text-amber-800">
                    This tool only works with public Instagram profiles. Private profiles cannot be accessed due to Instagram's privacy settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {profileData && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Information</h2>
              <p className="text-gray-600">View and download profile picture in different qualities</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Profile Info Card */}
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 p-1">
                      <img
                        src={profileData.profilePicUrl}
                        alt={`${profileData.username}'s profile`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">@{profileData.username}</h3>
                    <p className="text-lg text-gray-600">{profileData.fullName}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{profileData.postCount}</p>
                      <p className="text-sm text-gray-500">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{profileData.followerCount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{profileData.followingCount}</p>
                      <p className="text-sm text-gray-500">Following</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Options Card */}
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Standard Quality</h4>
                          <p className="text-sm text-gray-500">400x400 pixels</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          Fast
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={() => downloadImage(profileData.profilePicUrl, `${profileData.username}_profile_standard.jpg`)}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Standard
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(profileData.profilePicUrl)}
                            className="flex-1 border-2"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy URL
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openInNewTab(profileData.profilePicUrl)}
                            className="flex-1 border-2"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">HD Quality</h4>
                          <p className="text-sm text-gray-500">1080x1080 pixels</p>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold">
                          Premium
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={() => downloadImage(profileData.profilePicUrlHD, `${profileData.username}_profile_hd.jpg`)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download HD
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(profileData.profilePicUrlHD)}
                            className="flex-1 border-2"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy URL
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openInNewTab(profileData.profilePicUrlHD)}
                            className="flex-1 border-2"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profileData && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-200 rounded-full mb-6">
                <Instagram className="h-16 w-16 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Ready to View Profile</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed">
                Enter an Instagram username or profile URL above and click "View Profile" to see the profile picture and download options.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstagramProfileViewer;
