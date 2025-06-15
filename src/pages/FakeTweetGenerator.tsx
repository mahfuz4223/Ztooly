
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Twitter, Download, Copy, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark, Upload } from "lucide-react";
import { toast } from "sonner";

const FakeTweetGenerator = () => {
  const [tweetData, setTweetData] = useState({
    username: "johndoe",
    displayName: "John Doe",
    isVerified: true,
    profileImage: "",
    tweetText: "This is a sample tweet. @mentions, #hashtags, https://links.com are all automatically converted.",
    timestamp: "6m",
    date: "",
    likes: "400K",
    retweets: "21",
    replies: "500",
    views: "1M",
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
    const number = parseInt(num.replace(/[KM,]/g, '')) || 0;
    if (num.includes('M')) {
      return num;
    } else if (num.includes('K')) {
      return num;
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toLocaleString();
  };

  const generateRandomMetrics = () => {
    const likes = Math.floor(Math.random() * 1000000) + 1000;
    const retweets = Math.floor(Math.random() * (likes / 10)) + 1;
    const replies = Math.floor(Math.random() * (likes / 50)) + 1;
    const views = likes * (Math.floor(Math.random() * 5) + 2);
    
    setTweetData(prev => ({
      ...prev,
      likes: formatNumber(likes.toString()),
      retweets: formatNumber(retweets.toString()),
      replies: formatNumber(replies.toString()),
      views: formatNumber(views.toString())
    }));
    
    toast.success("Random engagement metrics generated!");
  };

  const renderTweetText = (text: string) => {
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
      } else if (part.startsWith('http')) {
        return (
          <span key={index} style={{ color: '#1d9bf0' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Custom verification badge component
  const VerificationBadge = ({ size = 20 }: { size?: number }) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#1d9bf0"
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle', 
        marginLeft: '4px',
        flexShrink: 0
      }}
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );

  const downloadTweet = async () => {
    setIsGenerating(true);
    const tweetElement = document.getElementById('fake-tweet');
    
    if (tweetElement) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        
        // Wait for fonts to load
        await document.fonts.ready;
        
        const canvas = await html2canvas(tweetElement, {
          backgroundColor: tweetData.theme === 'dark' ? '#000000' : '#ffffff',
          scale: 3,
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 598,
          height: tweetElement.scrollHeight,
          windowWidth: 598,
          windowHeight: tweetElement.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('fake-tweet');
            if (clonedElement) {
              // Ensure proper styling in cloned element
              clonedElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
              clonedElement.style.width = '598px';
              clonedElement.style.boxSizing = 'border-box';
              
              // Force hashtag and mention colors
              const blueElements = clonedElement.querySelectorAll('span[style*="color: rgb(29, 155, 240)"]');
              blueElements.forEach(element => {
                (element as HTMLElement).style.color = '#1d9bf0 !important';
                (element as HTMLElement).style.setProperty('color', '#1d9bf0', 'important');
              });
              
              // Fix SVG badge positioning
              const svgElements = clonedElement.querySelectorAll('svg');
              svgElements.forEach(svg => {
                (svg as unknown as HTMLElement).style.display = 'inline-block';
                (svg as unknown as HTMLElement).style.verticalAlign = 'middle';
                (svg as unknown as HTMLElement).style.marginLeft = '4px';
              });
            }
          }
        });

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
    { username: "johndoe", displayName: "John Doe", verified: true },
    { username: "elonmusk", displayName: "Elon Musk", verified: true },
    { username: "BillGates", displayName: "Bill Gates", verified: true },
    { username: "TheRealMikeT", displayName: "Mike Tyson", verified: true },
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
                      <VerificationBadge size={16} />
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
                        placeholder="6m"
                        value={tweetData.timestamp}
                        onChange={(e) => handleInputChange('timestamp', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Views</label>
                      <Input
                        placeholder="1M"
                        value={tweetData.views}
                        onChange={(e) => handleInputChange('views', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Replies</label>
                      <Input
                        placeholder="500"
                        value={tweetData.replies}
                        onChange={(e) => handleInputChange('replies', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Retweets</label>
                      <Input
                        placeholder="21"
                        value={tweetData.retweets}
                        onChange={(e) => handleInputChange('retweets', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Likes</label>
                      <Input
                        placeholder="400K"
                        value={tweetData.likes}
                        onChange={(e) => handleInputChange('likes', e.target.value)}
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
                        {preset.verified && <VerificationBadge size={16} />}
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
                  className={`border-0 rounded-none px-4 py-3 ${
                    tweetData.theme === 'dark' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black'
                  } max-w-lg mx-auto`}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    width: '598px',
                    fontSize: '15px',
                    lineHeight: '20px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Tweet Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        {tweetData.profileImage ? (
                          <img src={tweetData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {tweetData.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span 
                            className="font-bold truncate"
                            style={{ 
                              fontSize: '15px',
                              color: tweetData.theme === 'dark' ? '#e7e9ea' : '#0f1419',
                              fontWeight: '700',
                              maxWidth: '200px'
                            }}
                          >
                            {tweetData.displayName}
                          </span>
                          {tweetData.isVerified && <VerificationBadge size={20} />}
                          <span 
                            className="text-gray-500 truncate"
                            style={{ 
                              fontSize: '15px',
                              color: '#536471',
                              fontWeight: '400'
                            }}
                          >
                            @{tweetData.username}
                          </span>
                          <span 
                            className="text-gray-500"
                            style={{ 
                              fontSize: '15px',
                              color: '#536471'
                            }}
                          >
                            ·
                          </span>
                          <span 
                            className="text-gray-500"
                            style={{ 
                              fontSize: '15px',
                              color: '#536471'
                            }}
                          >
                            {tweetData.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-gray-500 flex-shrink-0" style={{ color: '#536471' }} />
                  </div>

                  {/* Tweet Content */}
                  <div className="mb-3 pl-13" style={{ paddingLeft: '52px' }}>
                    <p 
                      className="whitespace-pre-wrap"
                      style={{ 
                        fontSize: '15px',
                        lineHeight: '20px',
                        color: tweetData.theme === 'dark' ? '#e7e9ea' : '#0f1419',
                        margin: 0
                      }}
                    >
                      {renderTweetText(tweetData.tweetText)}
                    </p>
                  </div>

                  {/* Tweet Actions */}
                  <div className="flex items-center justify-between pt-3 pl-13" style={{ paddingLeft: '52px', paddingTop: '12px' }}>
                    <div className="flex items-center gap-1 group cursor-pointer">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 -ml-2">
                        <MessageCircle className="h-4 w-4" style={{ color: '#536471' }} />
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          fontSize: '13px',
                          color: '#536471'
                        }}
                      >
                        {tweetData.replies}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 group cursor-pointer">
                      <div className="p-2 rounded-full group-hover:bg-green-50 -ml-2">
                        <Repeat2 className="h-4 w-4" style={{ color: '#536471' }} />
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          fontSize: '13px',
                          color: '#536471'
                        }}
                      >
                        {tweetData.retweets}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 group cursor-pointer">
                      <div className="p-2 rounded-full group-hover:bg-red-50 -ml-2">
                        <Heart className="h-4 w-4" style={{ color: '#536471' }} />
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          fontSize: '13px',
                          color: '#536471'
                        }}
                      >
                        {tweetData.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 group cursor-pointer">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 -ml-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" style={{ color: '#536471' }}>
                          <path fill="currentColor" d="M8.75 21V3h2v18l-2-2zm6-18v18l2-2V3h-2z"/>
                        </svg>
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          fontSize: '13px',
                          color: '#536471'
                        }}
                      >
                        {tweetData.views}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full hover:bg-blue-50 -ml-2 cursor-pointer">
                        <Bookmark className="h-4 w-4" style={{ color: '#536471' }} />
                      </div>
                      <div className="p-2 rounded-full hover:bg-blue-50 -ml-2 cursor-pointer">
                        <Upload className="h-4 w-4" style={{ color: '#536471' }} />
                      </div>
                    </div>
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
