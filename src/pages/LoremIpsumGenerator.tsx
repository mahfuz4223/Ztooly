
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis'
  ];

  const generateLoremIpsum = () => {
    let result = [];
    
    for (let i = 0; i < paragraphs; i++) {
      let paragraph = [];
      let wordCount = wordsPerParagraph;
      
      // Start first paragraph with "Lorem ipsum" if enabled
      if (i === 0 && startWithLorem) {
        paragraph.push('Lorem', 'ipsum');
        wordCount -= 2;
      }
      
      // Generate remaining words
      for (let j = 0; j < wordCount; j++) {
        const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
        paragraph.push(randomWord);
      }
      
      // Capitalize first word and add period at the end
      paragraph[0] = paragraph[0].charAt(0).toUpperCase() + paragraph[0].slice(1);
      result.push(paragraph.join(' ') + '.');
    }
    
    setGeneratedText(result.join('\n\n'));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  React.useEffect(() => {
    generateLoremIpsum();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Lorem Ipsum Generator</h1>
              <p className="text-gray-600 mt-2">Generate placeholder text for your designs and layouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Generator Settings</CardTitle>
                <CardDescription>
                  Customize your Lorem Ipsum text generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                  <Input
                    id="paragraphs"
                    type="number"
                    min="1"
                    max="20"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="words">Words per Paragraph</Label>
                  <Input
                    id="words"
                    type="number"
                    min="10"
                    max="200"
                    value={wordsPerParagraph}
                    onChange={(e) => setWordsPerParagraph(Math.max(10, parseInt(e.target.value) || 50))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Options</Label>
                  <Select value={startWithLorem ? "lorem" : "random"} onValueChange={(value) => setStartWithLorem(value === "lorem")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lorem">Start with "Lorem ipsum"</SelectItem>
                      <SelectItem value="random">Start with random words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateLoremIpsum} className="w-full" size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Text
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Text */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Lorem Ipsum</CardTitle>
                    <CardDescription>
                      {paragraphs} paragraph{paragraphs !== 1 ? 's' : ''} • {wordsPerParagraph} words each
                    </CardDescription>
                  </div>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedText}
                  readOnly
                  className="min-h-[400px] resize-none"
                  placeholder="Generated text will appear here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;
