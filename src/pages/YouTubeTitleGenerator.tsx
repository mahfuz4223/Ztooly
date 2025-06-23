import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Youtube, TrendingUp, Target, Heart, Zap, Download, Lightbulb, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { UsageStats } from "@/components/UsageStats";

const YouTubeTitleGenerator = () => {
  const { trackAction } = useAnalytics({
    toolId: "youtube-title-generator",
    toolName: "YouTube Title Generator"
  });

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("general");
  const [titleStyle, setTitleStyle] = useState("clickbait");
  const [targetAudience, setTargetAudience] = useState("general");
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: "general", label: "General", emoji: "📝" },
    { value: "gaming", label: "Gaming", emoji: "🎮" },
    { value: "tech", label: "Technology", emoji: "💻" },
    { value: "lifestyle", label: "Lifestyle", emoji: "🌟" },
    { value: "education", label: "Education", emoji: "📚" },
    { value: "fitness", label: "Fitness", emoji: "💪" },
    { value: "cooking", label: "Cooking", emoji: "👨‍🍳" },
    { value: "travel", label: "Travel", emoji: "✈️" },
    { value: "business", label: "Business", emoji: "💼" },
    { value: "music", label: "Music", emoji: "🎵" },
    { value: "comedy", label: "Comedy", emoji: "😂" },
    { value: "diy", label: "DIY & Crafts", emoji: "🔨" }
  ];

  const titleStyles = [
    { value: "clickbait", label: "Clickbait", icon: "🔥" },
    { value: "informative", label: "Informative", icon: "📖" },
    { value: "question", label: "Question-based", icon: "❓" },
    { value: "list", label: "List/Number", icon: "📋" },
    { value: "howto", label: "How-to", icon: "🔧" },
    { value: "review", label: "Review", icon: "⭐" },
    { value: "trending", label: "Trending", icon: "📈" },
    { value: "emotional", label: "Emotional", icon: "💖" }
  ];

  const audiences = [
    { value: "general", label: "General Audience" },
    { value: "teens", label: "Teenagers (13-19)" },
    { value: "young_adults", label: "Young Adults (20-35)" },
    { value: "adults", label: "Adults (35+)" },
    { value: "kids", label: "Kids & Family" },
    { value: "professionals", label: "Professionals" }
  ];

  const generateTitles = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic to generate titles");
      return;
    }

    setIsGenerating(true);
    
    try {
      const categoryText = category !== 'general' ? ` for ${categories.find(c => c.value === category)?.label} content` : '';
      const keywordText = keywords ? ` Include these keywords: ${keywords}.` : '';
      const audienceText = targetAudience !== 'general' ? ` Target audience: ${audiences.find(a => a.value === targetAudience)?.label}.` : '';
      const styleText = titleStyles.find(s => s.value === titleStyle)?.label || 'engaging';
      
      const prompt = `Generate 12 compelling YouTube video titles for the topic: "${topic}"${categoryText}.
      
      Requirements:
      - Style: ${styleText} titles that grab attention
      - Keep titles between 60-70 characters for optimal display
      - Make them highly clickable and engaging
      - Use power words and emotional triggers
      - Include numbers when appropriate
      - Make them SEO-friendly${audienceText}${keywordText}
      
      Generate varied title formats:
      - Some with numbers/lists
      - Some as questions
      - Some with emotional hooks
      - Some with urgency/scarcity
      - Some with benefit-focused messaging
      
      Return only the titles, one per line, without numbering or bullets.`;

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
        const titleList = generatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.match(/^\d+\./))
          .slice(0, 12);        if (titleList.length > 0) {
          setTitles(titleList);
          // Track successful title generation
          trackAction('generate');
          toast.success(`Generated ${titleList.length} YouTube title ideas!`);
        } else {
          throw new Error("No valid titles generated");
        }
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error('Error generating titles:', error);
      toast.error("Failed to generate titles. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTitleSelection = (title: string) => {
    setSelectedTitles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };
  const copyTitle = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      // Track copy action
      trackAction('copy');
      toast.success("Title copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy title");
    }
  };

  const copyAllSelected = async () => {
    if (selectedTitles.length === 0) {
      toast.error("Please select some titles first");
      return;
    }    const titlesText = selectedTitles.join('\n');
    try {
      await navigator.clipboard.writeText(titlesText);
      // Track copy action for multiple titles
      trackAction('copy');
      toast.success(`Copied ${selectedTitles.length} titles!`);
    } catch (err) {
      toast.error("Failed to copy titles");
    }
  };

  const downloadTitles = () => {
    if (selectedTitles.length === 0) {
      toast.error("Please select some titles first");
      return;
    }

    const content = `YouTube Title Ideas for: ${topic}
Generated on: ${new Date().toLocaleDateString()}
Category: ${categories.find(c => c.value === category)?.label}
Style: ${titleStyles.find(s => s.value === titleStyle)?.label}
Target Audience: ${audiences.find(a => a.value === targetAudience)?.label}
Keywords: ${keywords || 'None'}

Titles:
${selectedTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Generated using Google Gemini AI`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-titles-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download action
    trackAction('download');
    toast.success("Titles downloaded!");
  };

  const clearAll = () => {
    setTopic("");
    setKeywords("");
    setTitles([]);
    setSelectedTitles([]);
    toast.success("All data cleared!");
  };

  const getCharacterCount = (title: string) => title.length;
  const getCharacterColor = (count: number) => {
    if (count <= 60) return "text-green-600";
    if (count <= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">YouTube Title Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create viral YouTube titles that get clicks and views</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
                  Video Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Video Topic *</label>
                  <Input
                    placeholder="e.g., How to build a gaming PC, Morning routine, React tutorial..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border-2 border-gray-200 focus:border-red-400 focus:ring-red-200"
                  />
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Keywords (comma-separated)</label>
                  <Input
                    placeholder="e.g., tutorial, beginner, 2024, easy, fast..."
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="border-2 border-gray-200 focus:border-red-400 focus:ring-red-200"
                  />
                </div>

                {/* Category, Style, and Audience Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-red-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{cat.emoji}</span>
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title Style</label>
                    <Select value={titleStyle} onValueChange={setTitleStyle}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-red-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {titleStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            <span className="flex items-center gap-2">
                              <span>{style.icon}</span>
                              {style.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Target Audience</label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-red-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audiences.map((aud) => (
                          <SelectItem key={aud.value} value={aud.value}>
                            {aud.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateTitles}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating Titles...
                      </>
                    ) : (
                      <>
                        <Youtube className="h-4 w-4" />
                        Generate YouTube Titles
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

            {/* Generated Titles */}
            {titles.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      Generated Titles ({titles.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllSelected}
                        size="sm"
                        variant="outline"
                        disabled={selectedTitles.length === 0}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Selected
                      </Button>
                      <Button
                        onClick={downloadTitles}
                        size="sm"
                        variant="outline"
                        disabled={selectedTitles.length === 0}
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
                    {titles.map((title, index) => {
                      const charCount = getCharacterCount(title);
                      const isSelected = selectedTitles.includes(title);
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleTitleSelection(title)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed mb-2">{title}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${getCharacterColor(charCount)}`}>
                                  {charCount} chars
                                </Badge>
                                {charCount <= 60 && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    ✓ Optimal
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <Badge variant="secondary" className="bg-red-100 text-red-700">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyTitle(title);
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
                  
                  {selectedTitles.length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700 font-medium">
                        {selectedTitles.length} title{selectedTitles.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* YouTube Tips */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Target className="h-5 w-5 text-red-600" />
                  YouTube Title Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600">📊</span>
                    <span className="text-gray-600">Keep titles under 60 characters for mobile display</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600">🎯</span>
                    <span className="text-gray-600">Include emotional triggers and power words</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600">🔢</span>
                    <span className="text-gray-600">Numbers in titles increase click-through rates</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600">❓</span>
                    <span className="text-gray-600">Questions create curiosity and engagement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  Current Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="outline" className="capitalize">
                    {categories.find(c => c.value === category)?.emoji} {categories.find(c => c.value === category)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Style</span>
                  <Badge variant="outline" className="capitalize">
                    {titleStyles.find(s => s.value === titleStyle)?.icon} {titleStyles.find(s => s.value === titleStyle)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audience</span>
                  <Badge variant="outline">{audiences.find(a => a.value === targetAudience)?.label}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Generated</span>
                  <Badge variant="outline">{titles.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Title Formulas */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Viral Formulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>How-to:</strong> "How I [Achievement] in [Time]"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>List:</strong> "[Number] [Things] That Will [Benefit]"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Secret:</strong> "The [Secret/Truth] About [Topic]"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Mistake:</strong> "Why Everyone Gets [Topic] Wrong"
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Character Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Optimal (Mobile)</span>
                    <Badge className="bg-green-100 text-green-700">≤ 60</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Good (Desktop)</span>
                    <Badge className="bg-yellow-100 text-yellow-700">61-70</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Too Long</span>
                    <Badge className="bg-red-100 text-red-700">&gt; 70</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>        </div>
        
        {/* Usage Statistics */}
        <UsageStats toolId="youtube-title-generator" />
      </div>
    </div>
  );
};

export default YouTubeTitleGenerator;
