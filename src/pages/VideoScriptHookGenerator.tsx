
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Video, Download, Lightbulb, Target, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";

const VideoScriptHookGenerator = () => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [videoType, setVideoType] = useState("educational");
  const [tone, setTone] = useState("engaging");
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHooks, setSelectedHooks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const videoTypes = [
    { value: "educational", label: "Educational/Tutorial", emoji: "📚" },
    { value: "entertainment", label: "Entertainment", emoji: "🎬" },
    { value: "product", label: "Product Review", emoji: "⭐" },
    { value: "storytelling", label: "Storytelling", emoji: "📖" },
    { value: "motivational", label: "Motivational", emoji: "💪" },
    { value: "news", label: "News/Update", emoji: "📰" },
    { value: "lifestyle", label: "Lifestyle/Vlog", emoji: "✨" },
    { value: "business", label: "Business/Marketing", emoji: "💼" }
  ];

  const tones = [
    { value: "engaging", label: "Engaging & Energetic", icon: "⚡" },
    { value: "conversational", label: "Conversational", icon: "💬" },
    { value: "dramatic", label: "Dramatic & Intense", icon: "🎭" },
    { value: "educational", label: "Educational & Clear", icon: "🎓" },
    { value: "humorous", label: "Humorous & Fun", icon: "😄" },
    { value: "mysterious", label: "Mysterious & Intriguing", icon: "🔍" },
    { value: "urgent", label: "Urgent & Direct", icon: "⏰" },
    { value: "inspiring", label: "Inspiring & Uplifting", icon: "🌟" }
  ];

  const generateHooks = async () => {
    if (!topic.trim()) {
      toast.error("Please provide a video topic");
      return;
    }

    setIsGenerating(true);
    
    try {
      const videoTypeText = videoTypes.find(v => v.value === videoType)?.label || 'educational';
      const toneText = tones.find(t => t.value === tone)?.label || 'engaging';
      const audienceText = audience ? `Target audience: ${audience}` : 'General audience';
      
      const prompt = `Generate 12 compelling video script hooks for:

Topic: ${topic}
Video Type: ${videoTypeText}
Tone: ${toneText}
${audienceText}

Requirements:
- Create hooks that grab attention in the first 3-5 seconds
- Make them compelling enough to stop scrolling
- Use proven hook formulas (question, statement, story teaser, etc.)
- Match the ${toneText.toLowerCase()} tone
- Be platform-agnostic (work for YouTube, TikTok, Instagram, etc.)
- Keep each hook under 20 words
- Make them unique and varied in approach

Hook types to include:
- Question hooks
- Statement/fact hooks
- Story teasers
- Problem/solution hooks
- Controversial/contrarian hooks
- Number/list hooks
- Before/after hooks
- Secret/reveal hooks

Return only the hook text, one per line, without numbering or bullets.`;

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
        const hookList = generatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.match(/^\d+\./))
          .slice(0, 12);

        if (hookList.length > 0) {
          setHooks(hookList);
          toast.success(`Generated ${hookList.length} video hook ideas!`);
        } else {
          throw new Error("No valid hooks generated");
        }
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error('Error generating hooks:', error);
      toast.error("Failed to generate hooks. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleHookSelection = (hook: string) => {
    setSelectedHooks(prev => 
      prev.includes(hook) 
        ? prev.filter(h => h !== hook)
        : [...prev, hook]
    );
  };

  const copyHook = async (hook: string) => {
    try {
      await navigator.clipboard.writeText(hook);
      toast.success("Hook copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy hook");
    }
  };

  const copyAllSelected = async () => {
    if (selectedHooks.length === 0) {
      toast.error("Please select some hooks first");
      return;
    }

    const hooksText = selectedHooks.join('\n\n');
    try {
      await navigator.clipboard.writeText(hooksText);
      toast.success(`Copied ${selectedHooks.length} hooks!`);
    } catch (err) {
      toast.error("Failed to copy hooks");
    }
  };

  const downloadHooks = () => {
    if (selectedHooks.length === 0) {
      toast.error("Please select some hooks first");
      return;
    }

    const content = `Video Script Hooks
Generated on: ${new Date().toLocaleDateString()}
Topic: ${topic}
Video Type: ${videoTypes.find(v => v.value === videoType)?.label}
Tone: ${tones.find(t => t.value === tone)?.label}
Audience: ${audience || 'General audience'}

Script Hooks:
${selectedHooks.map((hook, i) => `${i + 1}. ${hook}`).join('\n\n')}

Generated using Google Gemini AI`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-hooks-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Hooks downloaded!");
  };

  const clearAll = () => {
    setTopic("");
    setAudience("");
    setHooks([]);
    setSelectedHooks([]);
    toast.success("All data cleared!");
  };

  const getHookTypeLabel = (hook: string) => {
    if (hook.includes('?')) return 'Question';
    if (hook.toLowerCase().includes('secret') || hook.toLowerCase().includes('reveal')) return 'Secret';
    if (hook.match(/^\d+/)) return 'Number';
    if (hook.toLowerCase().includes('story') || hook.toLowerCase().includes('time')) return 'Story';
    if (hook.toLowerCase().includes('mistake') || hook.toLowerCase().includes('wrong')) return 'Problem';
    return 'Statement';
  };

  const getHookTypeColor = (type: string) => {
    const colors = {
      'Question': 'bg-blue-50 text-blue-700 border-blue-200',
      'Secret': 'bg-purple-50 text-purple-700 border-purple-200',
      'Number': 'bg-green-50 text-green-700 border-green-200',
      'Story': 'bg-orange-50 text-orange-700 border-orange-200',
      'Problem': 'bg-red-50 text-red-700 border-red-200',
      'Statement': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[type] || colors['Statement'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Video Script Hook Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create compelling opening hooks that grab attention in the first few seconds</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
                  Video Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic and Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Video Topic *</label>
                    <Input
                      placeholder="e.g., How to improve productivity, Best budget smartphones..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Target Audience</label>
                    <Input
                      placeholder="e.g., Entrepreneurs, Students, Parents..."
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* Video Type and Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Video Type</label>
                    <Select value={videoType} onValueChange={setVideoType}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {videoTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.emoji}</span>
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tone & Style</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400">
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
                    onClick={generateHooks}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating Hooks...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Video Hooks
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

            {/* Generated Hooks */}
            {hooks.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-600" />
                      Generated Hooks ({hooks.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllSelected}
                        size="sm"
                        variant="outline"
                        disabled={selectedHooks.length === 0}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Selected
                      </Button>
                      <Button
                        onClick={downloadHooks}
                        size="sm"
                        variant="outline"
                        disabled={selectedHooks.length === 0}
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
                    {hooks.map((hook, index) => {
                      const isSelected = selectedHooks.includes(hook);
                      const hookType = getHookTypeLabel(hook);
                      const typeColor = getHookTypeColor(hookType);
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleHookSelection(hook)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={`text-xs ${typeColor}`}>
                                  {hookType} Hook
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                  {hook.split(' ').length} words
                                </Badge>
                              </div>
                              <p className="text-gray-800 font-medium leading-relaxed text-lg">{hook}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  <Play className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyHook(hook);
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
                  
                  {selectedHooks.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">
                        {selectedHooks.length} hook{selectedHooks.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Hook Tips */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Hook Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">🎯</span>
                    <span className="text-gray-600">Hook viewers in the first 3-5 seconds</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">❓</span>
                    <span className="text-gray-600">Use questions to create curiosity gaps</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">🔥</span>
                    <span className="text-gray-600">Start with your most compelling point</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600">⏰</span>
                    <span className="text-gray-600">Keep hooks under 20 words for impact</span>
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
                  <span className="text-sm text-gray-600">Video Type</span>
                  <Badge variant="outline" className="capitalize">
                    {videoTypes.find(v => v.value === videoType)?.emoji} {videoTypes.find(v => v.value === videoType)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone</span>
                  <Badge variant="outline">
                    {tones.find(t => t.value === tone)?.icon} {tones.find(t => t.value === tone)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Generated</span>
                  <Badge variant="outline">{hooks.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Hook Types Guide */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Play className="h-5 w-5 text-purple-600" />
                  Hook Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded text-gray-700">
                    <strong>Question:</strong> Creates curiosity and engagement
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-gray-700">
                    <strong>Secret:</strong> Promises valuable insider information
                  </div>
                  <div className="p-2 bg-green-50 rounded text-gray-700">
                    <strong>Number:</strong> Specific, actionable content promise
                  </div>
                  <div className="p-2 bg-orange-50 rounded text-gray-700">
                    <strong>Story:</strong> Personal narrative that draws viewers in
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScriptHookGenerator;
