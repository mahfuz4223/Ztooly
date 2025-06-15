
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Copy, Instagram, Sparkles, Info, AlertCircle, Eye, Search, Link } from "lucide-react";
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
      const profileData = {
        username: cleanUsername,
        fullName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        profileUrl: `https://www.instagram.com/${cleanUsername}/`,
        webProfileUrl: `https://www.instagram.com/web/search/topsearch/?query=${cleanUsername}`,
        directUrl: `https://instagram.com/${cleanUsername}`,
        note: "Due to Instagram's privacy policies, profile data must be viewed directly on Instagram"
      };

      setProfileData(profileData);
      
      toast({
        title: "Profile Ready",
        description: "Click any button below to view the profile on Instagram",
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
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInstagramSearch = (username: string) => {
    const url = `https://www.instagram.com/web/search/topsearch/?query=${username}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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

  const quickActions = [
    {
      name: "Direct Profile",
      action: () => openInstagramProfile(profileData.username),
      icon: Eye,
      description: "Open profile directly",
      primary: true
    },
    {
      name: "Search Profile",
      action: () => openInstagramSearch(profileData.username),
      icon: Search,
      description: "Search for profile"
    },
    {
      name: "Copy URL",
      action: () => copyProfileUrl(profileData.username),
      icon: Copy,
      description: "Copy profile link"
    },
    {
      name: "External Link",
      action: () => openInstagramProfile(profileData.username),
      icon: ExternalLink,
      description: "Open in new tab"
    }
  ];

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
            Access Instagram profiles quickly and easily. View profiles directly on Instagram with enhanced navigation options.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
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
                  {isLoading ? 'Processing...' : 'Find Profile'}
                </Button>
              </div>
            </div>
            
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900 mb-1">Privacy Notice:</p>
                    <p className="text-sm text-amber-800">
                      This tool redirects to official Instagram pages. No data is stored or downloaded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {profileData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Found</h2>
              <p className="text-gray-600">Choose an action below to view the Instagram profile</p>
            </div>
            
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-pink-500 to-purple-500 p-1 bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                      <Instagram className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  @{profileData.username}
                </CardTitle>
                <p className="text-gray-600">{profileData.fullName}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      variant={action.primary ? "default" : "outline"}
                      className={`h-16 flex flex-col gap-1 ${
                        action.primary 
                          ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" 
                          : "border-2 hover:bg-gray-50"
                      }`}
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.name}</span>
                    </Button>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Note:</strong> {profileData.note}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Link className="h-4 w-4" />
                    <span>Profile URL: instagram.com/{profileData.username}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!profileData && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/60 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-200 rounded-full mb-6 shadow-lg">
                <Instagram className="h-12 w-12 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Ready to Find Profile</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed">
                Enter an Instagram username or profile URL above to access the profile with multiple viewing options.
              </p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg mx-auto flex items-center justify-center">
                    <Eye className="h-6 w-6 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-600">Direct Access</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Smart Search</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                    <Copy className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Copy Links</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                    <ExternalLink className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">New Tab</p>
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
