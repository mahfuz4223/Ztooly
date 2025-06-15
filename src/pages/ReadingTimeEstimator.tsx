
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Upload, Clock, BookOpen, Eye, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const ReadingTimeEstimator = () => {
  const [text, setText] = useState("");
  const [customWPM, setCustomWPM] = useState(200);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: "0 min",
    readingTimeSeconds: 0
  });

  // Calculate text statistics and reading time
  useEffect(() => {
    if (!text.trim()) {
      setStats({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 min",
        readingTimeSeconds: 0
      });
      return;
    }

    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    const readingTimeMinutes = words / customWPM;
    const readingTimeSeconds = Math.round(readingTimeMinutes * 60);
    
    let readingTime;
    if (readingTimeMinutes < 1) {
      readingTime = `${readingTimeSeconds} sec`;
    } else if (readingTimeMinutes < 60) {
      const minutes = Math.round(readingTimeMinutes);
      readingTime = `${minutes} min`;
    } else {
      const hours = Math.floor(readingTimeMinutes / 60);
      const minutes = Math.round(readingTimeMinutes % 60);
      readingTime = `${hours}h ${minutes}m`;
    }

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      readingTimeSeconds
    });
  }, [text, customWPM]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast.error("Please upload a text file (.txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      toast.success("File uploaded successfully!");
    };
    reader.readAsText(file);
  };

  const copyStats = async () => {
    const statsText = `Reading Time: ${stats.readingTime}
Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Speed: ${customWPM} WPM`;

    try {
      await navigator.clipboard.writeText(statsText);
      toast.success("Statistics copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy statistics");
    }
  };

  const downloadReport = () => {
    const reportContent = `Reading Time Analysis Report
========================================

Text Statistics:
- Reading Time: ${stats.readingTime}
- Words: ${stats.words}
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Reading Speed: ${customWPM} WPM

Original Text:
${text}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reading-time-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const clearText = () => {
    setText("");
    toast.success("Text cleared!");
  };

  const sampleTexts = [
    {
      title: "News Article",
      content: "Breaking news from around the world continues to shape our understanding of current events. Journalists work tirelessly to bring accurate and timely information to readers across various platforms."
    },
    {
      title: "Blog Post",
      content: "In today's digital age, content creation has become more important than ever. Writers and creators are constantly looking for ways to engage their audience with compelling stories and valuable insights."
    },
    {
      title: "Academic Text",
      content: "The methodology employed in this research study involves a comprehensive analysis of quantitative and qualitative data collected from multiple sources over an extended period of time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reading Time Estimator</h1>
          </div>
          <p className="text-gray-600 text-lg">Calculate how long it takes to read your text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Text Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">Upload a text file or paste your content below</p>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    variant="outline"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>

                {/* Text Area */}
                <Textarea
                  placeholder="Paste or type your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] resize-none border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200 text-base"
                />

                {/* Reading Speed Settings */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Reading Speed (WPM):
                  </label>
                  <Input
                    type="number"
                    value={customWPM}
                    onChange={(e) => setCustomWPM(Math.max(50, Math.min(1000, parseInt(e.target.value) || 200)))}
                    className="w-24"
                    min="50"
                    max="1000"
                  />
                  <span className="text-xs text-gray-500">Average: 200-250 WPM</span>
                </div>

                {/* Sample Texts */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Try Sample Texts:</label>
                  <div className="flex flex-wrap gap-2">
                    {sampleTexts.map((sample, index) => (
                      <Button
                        key={index}
                        onClick={() => setText(sample.content)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {sample.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={copyStats}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                    disabled={!text.trim()}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Statistics
                  </Button>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    className="gap-2 hover:bg-gray-50"
                    disabled={!text.trim()}
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="gap-2 hover:bg-gray-50"
                    disabled={!text.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Reading Time Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-indigo-600" />
                  Reading Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {stats.readingTime}
                  </div>
                  <p className="text-gray-600 text-sm">at {customWPM} words per minute</p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Text Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.words.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Words</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{stats.characters.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Characters</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Characters (no spaces)</span>
                    <Badge variant="outline">{stats.charactersNoSpaces.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sentences</span>
                    <Badge variant="outline">{stats.sentences.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paragraphs</span>
                    <Badge variant="outline">{stats.paragraphs.toLocaleString()}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Speed Info */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <Eye className="h-5 w-5 text-green-600" />
                  Reading Speed Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slow</span>
                    <span className="font-medium">150-200 WPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average</span>
                    <span className="font-medium">200-250 WPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fast</span>
                    <span className="font-medium">250-300 WPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed Reader</span>
                    <span className="font-medium">300+ WPM</span>
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

export default ReadingTimeEstimator;
