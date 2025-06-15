import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, ArrowLeft, Download, Settings, Type, Code, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState([50]);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [textType, setTextType] = useState('lorem');
  const [includeHtml, setIncludeHtml] = useState(false);
  const [htmlTags, setHtmlTags] = useState('p');
  const [sentenceLength, setSentenceLength] = useState([15]);
  const [generatedText, setGeneratedText] = useState('');
  const [customWords, setCustomWords] = useState('');

  const textTypes = {
    lorem: {
      name: 'Classic Lorem Ipsum',
      description: 'Traditional Latin placeholder text',
      words: [
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
      ]
    },
    tech: {
      name: 'Tech Lorem',
      description: 'Technology and development focused text',
      words: [
        'algorithm', 'api', 'application', 'backend', 'binary', 'blockchain', 'boolean',
        'cache', 'cloud', 'compiler', 'database', 'deployment', 'framework', 'frontend',
        'function', 'git', 'hash', 'interface', 'javascript', 'kernel', 'library',
        'machine', 'network', 'object', 'protocol', 'query', 'repository', 'server',
        'syntax', 'terminal', 'variable', 'webhook', 'xml', 'yaml', 'zip', 'debug',
        'encryption', 'firewall', 'hosting', 'integration', 'json', 'kubernetes',
        'linux', 'microservice', 'nodejs', 'optimization', 'programming', 'refactor',
        'scalability', 'testing', 'unity', 'version', 'workflow'
      ]
    },
    business: {
      name: 'Business Lorem',
      description: 'Corporate and business terminology',
      words: [
        'strategy', 'revenue', 'profit', 'market', 'customer', 'service', 'product',
        'brand', 'sales', 'marketing', 'analytics', 'growth', 'innovation', 'partnership',
        'stakeholder', 'investment', 'budget', 'forecast', 'metrics', 'performance',
        'optimization', 'efficiency', 'productivity', 'quality', 'compliance', 'risk',
        'opportunity', 'competitive', 'advantage', 'synergy', 'leverage', 'scalable',
        'sustainable', 'enterprise', 'solution', 'workflow', 'process', 'management',
        'leadership', 'team', 'collaboration', 'communication', 'objective', 'goal',
        'milestone', 'delivery', 'timeline', 'resource', 'allocation'
      ]
    },
    creative: {
      name: 'Creative Lorem',
      description: 'Artistic and design focused content',
      words: [
        'imagination', 'inspiration', 'creativity', 'artistic', 'design', 'aesthetic',
        'beautiful', 'elegant', 'innovative', 'unique', 'original', 'expressive',
        'vibrant', 'dynamic', 'captivating', 'mesmerizing', 'stunning', 'breathtaking',
        'magnificent', 'extraordinary', 'remarkable', 'fascinating', 'intriguing',
        'compelling', 'engaging', 'delightful', 'charming', 'graceful', 'sophisticated',
        'refined', 'polished', 'masterpiece', 'creation', 'vision', 'concept',
        'composition', 'harmony', 'balance', 'rhythm', 'texture', 'color', 'form',
        'style', 'technique', 'craft', 'artistry', 'excellence'
      ]
    }
  };

  const getWordList = () => {
    if (customWords.trim()) {
      return customWords.split(',').map(word => word.trim()).filter(word => word);
    }
    return textTypes[textType].words;
  };

  const generateSentence = (wordCount, isFirst = false) => {
    const words = getWordList();
    let sentence = [];
    
    if (isFirst && startWithLorem && textType === 'lorem') {
      sentence.push('Lorem', 'ipsum');
      wordCount -= 2;
    }
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      sentence.push(randomWord);
    }
    
    if (sentence.length > 0) {
      sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    }
    
    return sentence.join(' ') + '.';
  };

  const generateParagraph = (targetWords, isFirst = false) => {
    const sentences = [];
    let remainingWords = targetWords;
    
    while (remainingWords > 0) {
      const wordsInSentence = Math.min(
        remainingWords,
        Math.max(5, sentenceLength[0] + Math.floor(Math.random() * 10 - 5))
      );
      
      sentences.push(generateSentence(wordsInSentence, isFirst && sentences.length === 0));
      remainingWords -= wordsInSentence;
    }
    
    return sentences.join(' ');
  };

  const generateText = () => {
    const result = [];
    
    for (let i = 0; i < paragraphs; i++) {
      const paragraph = generateParagraph(wordsPerParagraph[0], i === 0);
      
      if (includeHtml) {
        switch (htmlTags) {
          case 'p':
            result.push(`<p>${paragraph}</p>`);
            break;
          case 'div':
            result.push(`<div>${paragraph}</div>`);
            break;
          case 'article':
            result.push(`<article>${paragraph}</article>`);
            break;
          case 'section':
            result.push(`<section>${paragraph}</section>`);
            break;
          default:
            result.push(paragraph);
        }
      } else {
        result.push(paragraph);
      }
    }
    
    const separator = includeHtml ? '\n' : '\n\n';
    setGeneratedText(result.join(separator));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lorem-ipsum-${textType}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Text downloaded successfully!");
  };

  const getWordCount = () => {
    return generatedText.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return generatedText.length;
  };

  React.useEffect(() => {
    generateText();
  }, [paragraphs, wordsPerParagraph, textType, startWithLorem, includeHtml, htmlTags, sentenceLength, customWords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100/80 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lorem Ipsum Generator</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Professional placeholder text generator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={generateText} variant="default" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Generate</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Quick Settings */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-lg">Quick Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="textType" className="text-sm font-medium">Text Style</Label>
                  <Select value={textType} onValueChange={setTextType}>
                    <SelectTrigger className="bg-white/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      {Object.entries(textTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Paragraphs</Label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-center font-semibold text-lg text-blue-600">
                      {paragraphs}
                    </div>
                    <Slider
                      value={[paragraphs]}
                      onValueChange={(value) => setParagraphs(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Words/Para</Label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-center font-semibold text-lg text-blue-600">
                      {wordsPerParagraph[0]}
                    </div>
                    <Slider
                      value={wordsPerParagraph}
                      onValueChange={setWordsPerParagraph}
                      max={200}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Tabs defaultValue="formatting" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/70">
                    <TabsTrigger value="formatting" className="text-xs">Format</TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="formatting" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Sentence Length: {sentenceLength[0]} words</Label>
                      <Slider
                        value={sentenceLength}
                        onValueChange={setSentenceLength}
                        max={30}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                        <div>
                          <Label htmlFor="startWithLorem" className="text-sm font-medium">Start with "Lorem ipsum"</Label>
                          <p className="text-xs text-gray-500">Classic opening for traditional text</p>
                        </div>
                        <Switch
                          id="startWithLorem"
                          checked={startWithLorem}
                          onCheckedChange={setStartWithLorem}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                        <div>
                          <Label htmlFor="includeHtml" className="text-sm font-medium">HTML Tags</Label>
                          <p className="text-xs text-gray-500">Wrap text in HTML elements</p>
                        </div>
                        <Switch
                          id="includeHtml"
                          checked={includeHtml}
                          onCheckedChange={setIncludeHtml}
                        />
                      </div>
                    </div>

                    {includeHtml && (
                      <div className="space-y-3">
                        <Label htmlFor="htmlTags" className="text-sm font-medium">HTML Element</Label>
                        <Select value={htmlTags} onValueChange={setHtmlTags}>
                          <SelectTrigger className="bg-white/70">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm">
                            <SelectItem value="p">&lt;p&gt; - Paragraph</SelectItem>
                            <SelectItem value="div">&lt;div&gt; - Division</SelectItem>
                            <SelectItem value="article">&lt;article&gt; - Article</SelectItem>
                            <SelectItem value="section">&lt;section&gt; - Section</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="custom" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Label htmlFor="customWords" className="text-sm font-medium">Custom Words</Label>
                      <Textarea
                        id="customWords"
                        placeholder="Enter custom words separated by commas..."
                        value={customWords}
                        onChange={(e) => setCustomWords(e.target.value)}
                        className="h-24 resize-none bg-white/70 text-sm"
                      />
                      <p className="text-xs text-gray-500">Leave empty to use the selected text style</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{paragraphs}</div>
                    <div className="text-xs text-gray-600">Paragraphs</div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getWordCount()}</div>
                    <div className="text-xs text-gray-600">Words</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getCharacterCount()}</div>
                    <div className="text-xs text-gray-600">Characters</div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-sm font-semibold text-blue-600 truncate">{textTypes[textType].name.split(' ')[0]}</div>
                    <div className="text-xs text-gray-600">Style</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Text Output */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <Code className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Generated Text</CardTitle>
                      <CardDescription className="text-sm">
                        {paragraphs} paragraph{paragraphs !== 1 ? 's' : ''} • {getWordCount()} words • {getCharacterCount()} characters
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2 bg-white/70 hover:bg-white">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={downloadText} variant="outline" size="sm" className="gap-2 bg-white/70 hover:bg-white">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedText}
                  readOnly
                  className="min-h-[400px] lg:min-h-[500xl] resize-none font-mono text-sm leading-relaxed bg-white/70 border-gray-200/50"
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
