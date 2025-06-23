
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, User, Heart, Zap, Download, Lightbulb, Target, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { UsageStats } from "@/components/UsageStats";

const SocialMediaBioGenerator = () => {
  const { trackAction } = useAnalytics({
    toolId: "social-media-bio-generator",
    toolName: "Social Media Bio Generator"
  });

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [personality, setPersonality] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [bios, setBios] = useState<string[]>([]);
  const [selectedBios, setSelectedBios] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { value: "instagram", label: "Instagram", emoji: "📸", limit: 150 },
    { value: "twitter", label: "Twitter/X", emoji: "🐦", limit: 160 },
    { value: "linkedin", label: "LinkedIn", emoji: "💼", limit: 220 },
    { value: "tiktok", label: "TikTok", emoji: "🎵", limit: 80 },
    { value: "facebook", label: "Facebook", emoji: "👥", limit: 101 },
    { value: "youtube", label: "YouTube", emoji: "📺", limit: 1000 },
    { value: "pinterest", label: "Pinterest", emoji: "📌", limit: 160 },
    { value: "snapchat", label: "Snapchat", emoji: "👻", limit: 200 }
  ];

  const tones = [
    { value: "professional", label: "Professional", icon: "💼" },
    { value: "casual", label: "Casual & Friendly", icon: "😊" },
    { value: "creative", label: "Creative & Artistic", icon: "🎨" },
    { value: "funny", label: "Funny & Witty", icon: "😄" },
    { value: "inspirational", label: "Inspirational", icon: "✨" },
    { value: "minimalist", label: "Simple & Clean", icon: "🔳" },
    { value: "trendy", label: "Trendy & Hip", icon: "🔥" },
    { value: "mysterious", label: "Mysterious", icon: "🌙" }
  ];

  const getCurrentPlatform = () => platforms.find(p => p.value === platform) || platforms[0];

  const generateBios = async () => {
    if (!name.trim() && !profession.trim()) {
      toast.error("Please provide at least your name or profession");
      return;
    }

    setIsGenerating(true);
    
    try {
      const currentPlatform = getCurrentPlatform();
      const characterLimit = currentPlatform.limit;
      
      const nameText = name ? `Name: ${name}` : '';
      const professionText = profession ? `Profession/Role: ${profession}` : '';
      const interestsText = interests ? `Interests/Hobbies: ${interests}` : '';
      const personalityText = personality ? `Personality traits: ${personality}` : '';
      const toneText = tones.find(t => t.value === tone)?.label || 'professional';
      
      const prompt = `Generate 10 engaging ${currentPlatform.label} bio variations for:
      
      ${nameText}
      ${professionText}
      ${interestsText}
      ${personalityText}
      
      Requirements:
      - Platform: ${currentPlatform.label}
      - Tone: ${toneText}
      - Character limit: ${characterLimit} characters
      - Make them unique and engaging
      - Include relevant emojis where appropriate
      - Follow ${currentPlatform.label} best practices
      - Make them attention-grabbing and memorable
      
      Platform-specific guidelines:
      ${platform === 'instagram' ? '- Focus on visual storytelling and lifestyle' : ''}
      ${platform === 'twitter' ? '- Be concise and impactful' : ''}
      ${platform === 'linkedin' ? '- Emphasize professional achievements and skills' : ''}
      ${platform === 'tiktok' ? '- Use trendy language and be fun' : ''}
      ${platform === 'facebook' ? '- Be personal and relatable' : ''}
      ${platform === 'youtube' ? '- Mention content type and upload schedule' : ''}
      
      Return only the bio text, one per line, without numbering or bullets.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAYLvZQ3zLz5r8yke7gCNQ4_hwdI8KdJEI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        const bioList = generatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.match(/^\d+\./))
          .slice(0, 10);        if (bioList.length > 0) {
          setBios(bioList);
          // Track successful bio generation
          trackAction('generate', `Generated ${bioList.length} bios for ${currentPlatform.label}`);
          toast.success(`Generated ${bioList.length} ${currentPlatform.label} bio ideas!`);
        } else {
          throw new Error("No valid bios generated");
        }
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error('Error generating bios:', error);
      toast.error("Failed to generate bios. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBioSelection = (bio: string) => {
    setSelectedBios(prev => 
      prev.includes(bio) 
        ? prev.filter(b => b !== bio)
        : [...prev, bio]
    );
  };
  const copyBio = async (bio: string) => {
    try {
      await navigator.clipboard.writeText(bio);
      // Track copy action
      trackAction('copy', 'Bio copied to clipboard');
      toast.success("Bio copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy bio");
    }
  };

  const copyAllSelected = async () => {
    if (selectedBios.length === 0) {
      toast.error("Please select some bios first");
      return;
    }    const biosText = selectedBios.join('\n\n');
    try {
      await navigator.clipboard.writeText(biosText);
      // Track copy action for multiple bios
      trackAction('copy', `Copied ${selectedBios.length} selected bios`);
      toast.success(`Copied ${selectedBios.length} bios!`);
    } catch (err) {
      toast.error("Failed to copy bios");
    }
  };

  const downloadBios = () => {
    if (selectedBios.length === 0) {
      toast.error("Please select some bios first");
      return;
    }

    const currentPlatform = getCurrentPlatform();
    const content = `${currentPlatform.label} Bio Ideas
Generated on: ${new Date().toLocaleDateString()}
Name: ${name || 'Not specified'}
Profession: ${profession || 'Not specified'}
Interests: ${interests || 'Not specified'}
Tone: ${tones.find(t => t.value === tone)?.label}

Bios:
${selectedBios.map((bio, i) => `${i + 1}. ${bio}`).join('\n\n')}

Generated using Google Gemini AI`;    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlatform.value}-bios-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download action
    trackAction('download', `Downloaded ${selectedBios.length} ${currentPlatform.label} bios`);
    toast.success("Bios downloaded!");
  };

  const clearAll = () => {
    setName("");
    setProfession("");
    setInterests("");
    setPersonality("");
    setBios([]);
    setSelectedBios([]);
    toast.success("All data cleared!");
  };

  const getCharacterCount = (bio: string) => bio.length;
  const getCharacterColor = (count: number, limit: number) => {
    const percentage = (count / limit) * 100;
    if (percentage <= 80) return "text-green-600";
    if (percentage <= 95) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media Bio Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create engaging bios for all your social media platforms</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🤖 Powered by Google Gemini AI
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <Input
                      placeholder="e.g., Sarah Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Profession/Role</label>
                    <Input
                      placeholder="e.g., Digital Marketing Expert, Artist, Student..."
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* Interests and Personality */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Interests/Hobbies</label>
                    <Input
                      placeholder="e.g., Photography, Travel, Fitness, Cooking, Music..."
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Personality Traits (Optional)</label>
                    <Input
                      placeholder="e.g., Creative, Ambitious, Funny, Adventurous..."
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* Platform and Tone Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((plat) => (
                          <SelectItem key={plat.value} value={plat.value}>
                            <span className="flex items-center gap-2">
                              <span>{plat.emoji}</span>
                              {plat.label}
                              <span className="text-xs text-gray-500">({plat.limit} chars)</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tone & Style</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <span className="flex items-center gap-2">
                              <span>{t.icon}</span>
                              {t.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateBios}
                    disabled={isGenerating || (!name.trim() && !profession.trim())}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating Bios...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Bio Ideas
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="gap-2 hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Bios */}
            {bios.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-600" />
                      Generated Bios ({bios.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllSelected}
                        size="sm"
                        variant="outline"
                        disabled={selectedBios.length === 0}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Selected
                      </Button>
                      <Button
                        onClick={downloadBios}
                        size="sm"
                        variant="outline"
                        disabled={selectedBios.length === 0}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {bios.map((bio, index) => {
                      const charCount = getCharacterCount(bio);
                      const charLimit = getCurrentPlatform().limit;
                      const isSelected = selectedBios.includes(bio);
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleBioSelection(bio)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed mb-2">{bio}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${getCharacterColor(charCount, charLimit)}`}>
                                  {charCount}/{charLimit} chars
                                </Badge>
                                {charCount <= charLimit && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    ✓ Fits {getCurrentPlatform().label}
                                  </Badge>
                                )}
                                {charCount > charLimit && (
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                    ⚠ Too long
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyBio(bio);
                                }}
                                className="gap-1"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedBios.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium">
                        {selectedBios.length} bio{selectedBios.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Bio Tips */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Bio Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">✨</span>
                    <span className="text-gray-600">Use emojis to add personality and visual appeal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">🎯</span>
                    <span className="text-gray-600">Include a clear call-to-action or value proposition</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">🔗</span>
                    <span className="text-gray-600">Add relevant keywords for better discoverability</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">💬</span>
                    <span className="text-gray-600">Show your personality and what makes you unique</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  Current Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform</span>
                  <Badge variant="outline" className="capitalize">
                    {getCurrentPlatform().emoji} {getCurrentPlatform().label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Character Limit</span>
                  <Badge variant="outline">{getCurrentPlatform().limit}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone</span>
                  <Badge variant="outline">
                    {tones.find(t => t.value === tone)?.icon} {tones.find(t => t.value === tone)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Generated</span>
                  <Badge variant="outline">{bios.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Platform Guides */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Platform Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Instagram:</strong> Visual storytelling, lifestyle focus
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>LinkedIn:</strong> Professional achievements, skills
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Twitter:</strong> Concise, impactful messaging
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>TikTok:</strong> Fun, trendy, youthful energy
                  </div>
                </div>
              </CardContent>            </Card>
          </div>
        </div>
        
        {/* Usage Statistics */}
        <UsageStats toolId="social-media-bio-generator" />
      </div>
    </div>
  );
};

export default SocialMediaBioGenerator;
