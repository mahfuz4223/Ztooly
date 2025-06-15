
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Twitter, Download, Copy, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified } from "lucide-react";
import { toast } from "sonner";

const FakeTweetGenerator = () => {
  const [tweetData, setTweetData] = useState({
    username: "neiltyson",
    displayName: "Neil deGrasse Tyson",
    isVerified: true,
    profileImage: "",
    tweetText: "gaming #gg",
    timestamp: "2:30 PM",
    date: "Dec 15, 2024",
    likes: "3,300",
    retweets: "1,300",
    replies: "102",
    theme: "light"
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setTweetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatNumber = (num: string) => {
    const number = parseInt(num.replace(/,/g, '')) || 0;
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toLocaleString();
  };

  const generateRandomMetrics = () => {
    const likes = Math.floor(Math.random() * 10000) + 1;
    const retweets = Math.floor(Math.random() * (likes / 2)) + 1;
    const replies = Math.floor(Math.random() * (likes / 10)) + 1;
    
    setTweetData(prev => ({
      ...prev,
      likes: likes.toLocaleString(),
      retweets: retweets.toLocaleString(),
      replies: replies.toLocaleString()
    }));
    
    toast.success("Random engagement metrics generated!");
  };

  const renderTweetText = (text: string, isDark: boolean = false) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} style={{ color: '#1d9bf0' }}>
            {part}
          </span>
        );
      } else if (part.startsWith('@')) {
        return (
          <span key={index} style={{ color: '#1d9bf0' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const downloadTweet = async () => {
    setIsGenerating(true);
    const tweetElement = document.getElementById('fake-tweet');
    
    if (tweetElement) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        
        // Create a clone of the element for rendering
        const clonedElement = tweetElement.cloneNode(true) as HTMLElement;
        clonedElement.style.position = 'absolute';
        clonedElement.style.top = '-9999px';
        clonedElement.style.left = '-9999px';
        clonedElement.style.width = '598px'; // Fixed width for consistency
        document.body.appendChild(clonedElement);

        const canvas = await html2canvas(clonedElement, {
          backgroundColor: tweetData.theme === 'dark' ? '#000000' : '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: false,
          width: 598,
          height: clonedElement.offsetHeight,
          logging: false,
          ignoreElements: (element) => {
            return element.tagName === 'BUTTON' || element.classList.contains('no-capture');
          }
        });

        // Remove the cloned element
        document.body.removeChild(clonedElement);

        const link = document.createElement('a');
        link.download = `fake-tweet-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        toast.success("Tweet image downloaded!");
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error("Failed to download tweet image");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const copyTweetText = async () => {
    try {
      await navigator.clipboard.writeText(tweetData.tweetText);
      toast.success("Tweet text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy tweet text");
    }
  };

  const presetUsers = [
    { username: "elonmusk", displayName: "Elon Musk", verified: true },
    { username: "BillGates", displayName: "Bill Gates", verified: true },
    { username: "TheRealMikeT", displayName: "Mike Tyson", verified: true },
    { username: "RobertDowneyJr", displayName: "Robert Downey Jr.", verified: true },
    { username: "neiltyson", displayName: "Neil deGrasse Tyson", verified: true }
  ];

  const applyPreset = (preset: typeof presetUsers[0]) => {
    setTweetData(prev => ({
      ...prev,
      username: preset.username,
      displayName: preset.displayName,
      isVerified: preset.verified
    }));
    toast.success(`Applied ${preset.displayName} preset!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Twitter className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fake Tweet Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create realistic-looking fake tweets for fun, education, or mockups</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🎭 For Entertainment & Educational Purposes Only
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Twitter className="h-6 w-6 text-blue-500" />
                  Tweet Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    👤 Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <Input
                        placeholder="@username"
                        value={tweetData.username}
                        onChange={(e) => handleInputChange('username', e.target.value.replace('@', ''))}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Display Name</label>
                      <Input
                        placeholder="Display Name"
                        value={tweetData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tweetData.isVerified}
                        onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <Verified className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Verified Account</span>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Tweet Content */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    💬 Tweet Content
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tweet Text</label>
                    <Textarea
                      placeholder="What's happening?"
                      value={tweetData.tweetText}
                      onChange={(e) => handleInputChange('tweetText', e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 min-h-24"
                      maxLength={280}
                    />
                    <div className="text-right">
                      <Badge variant="outline" className={tweetData.tweetText.length > 280 ? 'text-red-600' : 'text-gray-600'}>
                        {tweetData.tweetText.length}/280
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timestamp and Engagement */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    📊 Timestamp & Engagement
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <Input
                        placeholder="2:30 PM"
                        value={tweetData.timestamp}
                        onChange={(e) => handleInputChange('timestamp', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <Input
                        placeholder="Dec 15, 2024"
                        value={tweetData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Likes</label>
                      <Input
                        placeholder="1,234"
                        value={tweetData.likes}
                        onChange={(e) => handleInputChange('likes', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Retweets</label>
                      <Input
                        placeholder="567"
                        value={tweetData.retweets}
                        onChange={(e) => handleInputChange('retweets', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Replies</label>
                      <Input
                        placeholder="89"
                        value={tweetData.replies}
                        onChange={(e) => handleInputChange('replies', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={generateRandomMetrics}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    🎲 Generate Random Metrics
                  </Button>
                </div>

                <Separator />

                {/* Theme Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    🎨 Theme
                  </h3>
                  <Select value={tweetData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">🌞 Light Theme</SelectItem>
                      <SelectItem value="dark">🌙 Dark Theme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preset Users */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Quick Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {presetUsers.map((preset) => (
                    <Button
                      key={preset.username}
                      onClick={() => applyPreset(preset)}
                      variant="outline"
                      className="justify-start gap-2 h-auto p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="font-medium">{preset.displayName}</span>
                        {preset.verified && <Verified className="h-4 w-4 text-blue-500" />}
                        <span className="text-gray-500">@{preset.username}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  👁️ Tweet Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Fake Tweet */}
                <div 
                  id="fake-tweet"
                  className={`border rounded-xl p-6 ${
                    tweetData.theme === 'dark' 
                      ? 'bg-black text-white border-gray-800' 
                      : 'bg-white text-black border-gray-200'
                  } max-w-lg mx-auto shadow-lg`}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    width: '598px'
                  }}
                >
                  {/* Tweet Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {tweetData.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold truncate text-base">{tweetData.displayName}</span>
                        {tweetData.isVerified && (
                          <Verified className="h-5 w-5 text-blue-500 flex-shrink-0" fill="currentColor" />
                        )}
                      </div>
                      <span className={`text-sm ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{tweetData.username}
                      </span>
                    </div>
                    <MoreHorizontal className={`h-5 w-5 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                  </div>

                  {/* Tweet Content */}
                  <div className="mb-4">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {renderTweetText(tweetData.tweetText, tweetData.theme === 'dark')}
                    </p>
                  </div>

                  {/* Tweet Timestamp */}
                  <div className={`text-sm mb-4 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tweetData.timestamp} · {tweetData.date}
                  </div>

                  {/* Tweet Actions */}
                  <div className={`flex items-center justify-between pt-3 border-t ${tweetData.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1">
                      <MessageCircle className={`h-5 w-5 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatNumber(tweetData.replies)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className={`h-5 w-5 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatNumber(tweetData.retweets)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className={`h-5 w-5 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatNumber(tweetData.likes)}
                      </span>
                    </div>
                    <Share className={`h-5 w-5 ${tweetData.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={downloadTweet}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Download'}
                  </Button>
                  <Button
                    onClick={copyTweetText}
                    variant="outline"
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Text
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="shadow-xl border-0 bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-amber-800 mb-2">⚠️ Important Disclaimer</h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    This tool is for entertainment, educational, and design mockup purposes only. 
                    Do not use fake tweets to deceive, defame, or spread misinformation. 
                    Always use responsibly and ethically.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeTweetGenerator;
