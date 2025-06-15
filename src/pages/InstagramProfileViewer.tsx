
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, User, ExternalLink, Copy, Instagram, Sparkles, Info, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstagramProfileViewer = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
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
    setImageError(false);
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
      // For demonstration, we'll construct potential Instagram profile picture URLs
      // Note: These URLs may not work due to Instagram's restrictions
      const profilePicUrl = `https://www.instagram.com/${cleanUsername}/`;
      const profilePicDirectUrl = `https://instagram.com/${cleanUsername}`;
      
      const profileData = {
        username: cleanUsername,
        fullName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        profilePicUrl: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`,
        profileUrl: `https://www.instagram.com/${cleanUsername}/`,
        isPrivate: null, // Unknown without API access
        note: "Profile data is limited due to Instagram's API restrictions"
      };

      setProfileData(profileData);
      
      toast({
        title: "Profile Loaded",
        description: "Click 'Open Profile' to view on Instagram",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process username. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInstagramProfile = (username: string) => {
    const url = `https://www.instagram.com/${username}/`;
    window.open(url, '_blank');
  };

  const copyProfileUrl = async (username: string) => {
    try {
      const url = `https://www.instagram.com/${username}/`;
      await navigator.clipboard.writeText(url);
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
            View Instagram profiles quickly and easily. Open profiles directly on Instagram with a single click.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-10 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              View Instagram Profile
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
                  {isLoading ? 'Processing...' : 'View Profile'}
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
                    Due to Instagram's API restrictions and privacy policies, this tool will redirect you to the official Instagram profile page. Profile pictures and data cannot be directly accessed or downloaded from third-party applications.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Ready</h2>
              <p className="text-gray-600">Click the buttons below to view the profile on Instagram</p>
            </div>
            
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 justify-center">
                  <User className="h-5 w-5" />
                  @{profileData.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 p-1 bg-gradient-to-r from-pink-500 to-purple-500">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <Instagram className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">@{profileData.username}</h3>
                  <p className="text-lg text-gray-600">{profileData.fullName}</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <Button
                    onClick={() => openInstagramProfile(profileData.username)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-12 text-lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Open Instagram Profile
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyProfileUrl(profileData.username)}
                      className="flex-1 border-2 h-12"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Profile URL
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openInstagramProfile(profileData.username)}
                      className="flex-1 border-2 h-12"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Instagram
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>Note:</strong> {profileData.note}
                  </p>
                </div>
              </CardContent>
            </Card>
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
                Enter an Instagram username or profile URL above and click "View Profile" to access the Instagram profile page directly.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstagramProfileViewer;
