import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Hash, Sparkles, Download, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAIToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

const HashtagGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [customHashtag, setCustomHashtag] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  // Initialize analytics
  const analytics = useAIToolAnalytics('hashtag-generator', 'Hashtag Generator');

  const hashtagCategories = {
    trending: ["viral", "trending", "fyp", "explore", "popular", "hot", "new", "amazing"],
    social: ["love", "happy", "fun", "friends", "family", "life", "smile", "good"],
    business: ["entrepreneur", "business", "success", "motivation", "work", "professional", "career", "goals"],
    lifestyle: ["lifestyle", "daily", "inspiration", "wellness", "health", "fitness", "travel", "food"],
    creative: ["art", "creative", "design", "photography", "beautiful", "style", "aesthetic", "vibes"],
    tech: ["tech", "innovation", "digital", "future", "coding", "ai", "startup", "technology"]
  };

  const generateHashtags = useCallback(() => {
    // Track generation action
    analytics.trackGenerate();
    
    if (!inputText.trim()) {
      toast.error("Please enter some text to generate hashtags");
      return;
    }

    const words = inputText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const newHashtags = new Set<string>();

    // Add hashtags based on input words
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2) {
        newHashtags.add(cleanWord);
      }
    });

    // Add relevant category hashtags based on keywords
    Object.entries(hashtagCategories).forEach(([category, tags]) => {
      const hasMatch = words.some(word => 
        tags.some(tag => word.includes(tag) || tag.includes(word))
      );
      if (hasMatch) {
        tags.slice(0, 3).forEach(tag => newHashtags.add(tag));
      }
    });

    // Add some general popular hashtags
    const generalTags = ["instagood", "photooftheday", "follow", "like4like", "picoftheday"];
    generalTags.slice(0, 2).forEach(tag => newHashtags.add(tag));

    setGeneratedHashtags(Array.from(newHashtags).slice(0, 30));
    toast.success("Hashtags generated successfully!");
  }, [inputText]);

  const addCustomHashtag = () => {
    if (!customHashtag.trim()) return;
    
    const cleanTag = customHashtag.replace(/[^\w]/g, '').toLowerCase();
    if (cleanTag && !generatedHashtags.includes(cleanTag)) {
      setGeneratedHashtags(prev => [cleanTag, ...prev]);
      setCustomHashtag("");
      toast.success("Custom hashtag added!");
    }
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const selectAllHashtags = () => {
    setSelectedHashtags([...generatedHashtags]);
    toast.success("All hashtags selected!");
  };

  const clearSelection = () => {
    setSelectedHashtags([]);
    toast.success("Selection cleared!");
  };

  const copyHashtags = async () => {
    if (selectedHashtags.length === 0) {
      toast.error("Please select some hashtags to copy");
      return;
    }

    const hashtagText = selectedHashtags.map(tag => `#${tag}`).join(" ");
    
    try {
      await navigator.clipboard.writeText(hashtagText);
      toast.success(`Copied ${selectedHashtags.length} hashtags to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy hashtags");
    }
  };

  const downloadHashtags = () => {
    if (selectedHashtags.length === 0) {
      toast.error("Please select some hashtags to download");
      return;
    }

    const hashtagText = selectedHashtags.map(tag => `#${tag}`).join(" ");
    const blob = new Blob([hashtagText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hashtags.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Hashtags downloaded!");
  };

  const clearAll = () => {
    setInputText("");
    setGeneratedHashtags([]);
    setSelectedHashtags([]);
    setCustomHashtag("");
    toast.success("All data cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Hashtag Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Generate trending hashtags for your social media posts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Content Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Describe your post content here... (e.g., 'Beautiful sunset at the beach with friends')"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200 text-base"
                />
                
                {/* Custom Hashtag Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Add Custom Hashtag</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter custom hashtag (without #)"
                      value={customHashtag}
                      onChange={(e) => setCustomHashtag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomHashtag()}
                      className="flex-1"
                    />
                    <Button
                      onClick={addCustomHashtag}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateHashtags}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                    disabled={!inputText.trim()}
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Hashtags
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <Hash className="h-6 w-6 text-pink-600" />
                    Generated Hashtags ({generatedHashtags.length})
                  </CardTitle>
                  {generatedHashtags.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={selectAllHashtags}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        onClick={clearSelection}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {generatedHashtags.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
                      {generatedHashtags.map((hashtag, index) => (
                        <Badge
                          key={index}
                          variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-sm py-2 px-3 ${
                            selectedHashtags.includes(hashtag)
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                              : "hover:bg-purple-50 hover:border-purple-300"
                          }`}
                          onClick={() => toggleHashtag(hashtag)}
                        >
                          #{hashtag}
                        </Badge>
                      ))}
                    </div>

                    {/* Selected Hashtags Preview */}
                    {selectedHashtags.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Selected ({selectedHashtags.length})
                          </label>
                          <Button
                            onClick={() => setSelectedHashtags([])}
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-sm text-gray-800 break-words">
                            {selectedHashtags.map(tag => `#${tag}`).join(" ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={copyHashtags}
                        className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
                        disabled={selectedHashtags.length === 0}
                      >
                        <Copy className="h-4 w-4" />
                        Copy Selected
                      </Button>
                      <Button
                        onClick={downloadHashtags}
                        variant="outline"
                        className="gap-2 hover:bg-gray-50"
                        disabled={selectedHashtags.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Hash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No hashtags generated yet</p>
                    <p className="text-sm">Enter your content description and click "Generate Hashtags"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>        </div>

        {/* Usage Statistics */}
        <UsageStats toolId="hashtag-generator" />
      </div>
    </div>
  );
};

export default HashtagGenerator;
