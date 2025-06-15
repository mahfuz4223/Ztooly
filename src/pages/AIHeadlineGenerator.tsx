
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Sparkles, Lightbulb, Target, Heart, Zap, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

const AIHeadlineGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [industry, setIndustry] = useState("general");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [selectedHeadlines, setSelectedHeadlines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tones = [
    { value: "professional", label: "Professional", icon: "💼" },
    { value: "casual", label: "Casual", icon: "😊" },
    { value: "urgent", label: "Urgent", icon: "⚡" },
    { value: "inspiring", label: "Inspiring", icon: "✨" },
    { value: "humorous", label: "Humorous", icon: "😄" },
    { value: "mysterious", label: "Mysterious", icon: "🔮" }
  ];

  const industries = [
    { value: "general", label: "General" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "health", label: "Health & Wellness" },
    { value: "education", label: "Education" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" }
  ];

  const headlineTemplates = {
    professional: [
      "How to {topic}: A Complete Guide",
      "{topic}: Best Practices for 2024",
      "The Ultimate {topic} Strategy",
      "5 Essential {topic} Tips Every Professional Should Know",
      "Transform Your {topic} with These Proven Methods"
    ],
    casual: [
      "Why Everyone's Talking About {topic}",
      "The Simple Truth About {topic}",
      "{topic} Made Easy: Your Quick Guide",
      "What I Learned About {topic} (And You Should Too)",
      "The Real Deal on {topic}"
    ],
    urgent: [
      "URGENT: {topic} Changes You Need to Know Now",
      "Don't Miss Out: Critical {topic} Updates",
      "Act Fast: {topic} Opportunity Ending Soon",
      "Breaking: Major {topic} Developments",
      "Time-Sensitive {topic} Alert"
    ],
    inspiring: [
      "Unlock Your {topic} Potential Today",
      "Transform Your Life with {topic}",
      "The {topic} Journey That Changed Everything",
      "Rise Above: Mastering {topic}",
      "Your {topic} Success Story Starts Here"
    ],
    humorous: [
      "Why {topic} is Like Pizza (Everyone Has an Opinion)",
      "The Hilarious Truth About {topic}",
      "{topic}: What They Don't Tell You",
      "Confessions of a {topic} Enthusiast",
      "The Funny Side of {topic}"
    ],
    mysterious: [
      "The Secret Behind {topic} Revealed",
      "What Experts Won't Tell You About {topic}",
      "The Hidden Truth of {topic}",
      "Mysterious {topic} Facts That Will Shock You",
      "The {topic} Secret Nobody Talks About"
    ]
  };

  const generateHeadlines = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic to generate headlines");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const templates = headlineTemplates[tone as keyof typeof headlineTemplates];
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      let generatedHeadlines = templates.map(template => 
        template.replace(/{topic}/g, topic)
      );

      // Add keyword variations if keywords are provided
      if (keywordList.length > 0) {
        const keywordHeadlines = [
          `${keywordList[0]}: The Complete ${topic} Guide`,
          `Master ${topic} with ${keywordList[0]}`,
          `${keywordList.join(', ')} and ${topic}: A Perfect Match`
        ];
        generatedHeadlines = [...generatedHeadlines, ...keywordHeadlines];
      }

      // Add industry-specific headlines
      if (industry !== "general") {
        const industryHeadlines = [
          `${topic} for ${industry.charAt(0).toUpperCase() + industry.slice(1)} Professionals`,
          `How ${industry.charAt(0).toUpperCase() + industry.slice(1)} Leaders Use ${topic}`,
          `${topic} Trends Shaping the ${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry`
        ];
        generatedHeadlines = [...generatedHeadlines, ...industryHeadlines];
      }

      setHeadlines(generatedHeadlines.slice(0, 10)); // Limit to 10 headlines
      setIsGenerating(false);
      toast.success(`Generated ${generatedHeadlines.slice(0, 10).length} headlines!`);
    }, 1500);
  };

  const toggleHeadlineSelection = (headline: string) => {
    setSelectedHeadlines(prev => 
      prev.includes(headline) 
        ? prev.filter(h => h !== headline)
        : [...prev, headline]
    );
  };

  const copyHeadline = async (headline: string) => {
    try {
      await navigator.clipboard.writeText(headline);
      toast.success("Headline copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy headline");
    }
  };

  const copyAllSelected = async () => {
    if (selectedHeadlines.length === 0) {
      toast.error("Please select some headlines first");
      return;
    }

    const headlinesText = selectedHeadlines.join('\n');
    try {
      await navigator.clipboard.writeText(headlinesText);
      toast.success(`Copied ${selectedHeadlines.length} headlines!`);
    } catch (err) {
      toast.error("Failed to copy headlines");
    }
  };

  const downloadHeadlines = () => {
    if (selectedHeadlines.length === 0) {
      toast.error("Please select some headlines first");
      return;
    }

    const content = `AI Generated Headlines for: ${topic}
Generated on: ${new Date().toLocaleDateString()}
Tone: ${tone}
Industry: ${industry}
Keywords: ${keywords || 'None'}

Headlines:
${selectedHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `headlines-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Headlines downloaded!");
  };

  const clearAll = () => {
    setTopic("");
    setKeywords("");
    setHeadlines([]);
    setSelectedHeadlines([]);
    toast.success("All data cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Headline Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create compelling headlines that grab attention and drive engagement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  Content Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Topic or Subject *</label>
                  <Input
                    placeholder="e.g., Digital Marketing, Productivity Tips, Healthy Recipes..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                  />
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Keywords (comma-separated)</label>
                  <Input
                    placeholder="e.g., SEO, growth, strategy, tips..."
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                  />
                </div>

                {/* Tone Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tone</label>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Industry</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateHeadlines}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Headlines
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

            {/* Generated Headlines */}
            {headlines.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-600" />
                      Generated Headlines ({headlines.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllSelected}
                        size="sm"
                        variant="outline"
                        disabled={selectedHeadlines.length === 0}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Selected
                      </Button>
                      <Button
                        onClick={downloadHeadlines}
                        size="sm"
                        variant="outline"
                        disabled={selectedHeadlines.length === 0}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {headlines.map((headline, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedHeadlines.includes(headline)
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleHeadlineSelection(headline)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium leading-relaxed">{headline}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {selectedHeadlines.includes(headline) && (
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
                                copyHeadline(headline);
                              }}
                              className="gap-1"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedHeadlines.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium">
                        {selectedHeadlines.length} headline{selectedHeadlines.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Headline Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600">💡</span>
                    <span className="text-gray-600">Use numbers and specific details for better engagement</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600">🎯</span>
                    <span className="text-gray-600">Include power words that trigger emotions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600">⚡</span>
                    <span className="text-gray-600">Keep headlines between 50-60 characters for SEO</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600">🔍</span>
                    <span className="text-gray-600">Test different variations to see what works</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  Current Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone</span>
                  <Badge variant="outline" className="capitalize">
                    {tones.find(t => t.value === tone)?.icon} {tone}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Industry</span>
                  <Badge variant="outline" className="capitalize">{industry}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Keywords</span>
                  <Badge variant="outline">
                    {keywords ? keywords.split(',').length : 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Generated</span>
                  <Badge variant="outline">{headlines.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Popular Formulas */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Popular Formulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>How to:</strong> "How to [Achieve Goal] in [Time Frame]"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Number:</strong> "[Number] [Things] That Will [Benefit]"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Question:</strong> "Why [Question About Topic]?"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700">
                    <strong>Secret:</strong> "The Secret to [Desired Outcome]"
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

export default AIHeadlineGenerator;
