
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
import { Copy, RefreshCw, ArrowLeft, Download, Settings, Type, Code } from "lucide-react";
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
      name: 'Lorem Ipsum',
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
    
    // Capitalize first word
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Type className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Lorem Ipsum Generator Pro</h1>
                  <p className="text-gray-600 mt-1">Professional placeholder text generator with advanced customization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Advanced Controls */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Generator Settings</CardTitle>
                </div>
                <CardDescription>
                  Customize your text generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="textType">Text Type</Label>
                      <Select value={textType} onValueChange={setTextType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(textTypes).map(([key, type]) => (
                            <SelectItem key={key} value={key}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paragraphs">Paragraphs: {paragraphs}</Label>
                      <Slider
                        value={[paragraphs]}
                        onValueChange={(value) => setParagraphs(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="words">Words per Paragraph: {wordsPerParagraph[0]}</Label>
                      <Slider
                        value={wordsPerParagraph}
                        onValueChange={setWordsPerParagraph}
                        max={200}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="sentenceLength">Average Sentence Length: {sentenceLength[0]}</Label>
                      <Slider
                        value={sentenceLength}
                        onValueChange={setSentenceLength}
                        max={30}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="startWithLorem">Start with "Lorem ipsum"</Label>
                      <Switch
                        id="startWithLorem"
                        checked={startWithLorem}
                        onCheckedChange={setStartWithLorem}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeHtml">Include HTML tags</Label>
                      <Switch
                        id="includeHtml"
                        checked={includeHtml}
                        onCheckedChange={setIncludeHtml}
                      />
                    </div>

                    {includeHtml && (
                      <div className="space-y-2">
                        <Label htmlFor="htmlTags">HTML Tag</Label>
                        <Select value={htmlTags} onValueChange={setHtmlTags}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="p">&lt;p&gt;</SelectItem>
                            <SelectItem value="div">&lt;div&gt;</SelectItem>
                            <SelectItem value="article">&lt;article&gt;</SelectItem>
                            <SelectItem value="section">&lt;section&gt;</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="customWords">Custom Words (comma-separated)</Label>
                      <Textarea
                        id="customWords"
                        placeholder="Enter custom words separated by commas..."
                        value={customWords}
                        onChange={(e) => setCustomWords(e.target.value)}
                        className="h-20 resize-none"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button onClick={generateText} className="w-full" size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Text
                </Button>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Paragraphs:</span>
                  <span className="font-semibold">{paragraphs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Words:</span>
                  <span className="font-semibold">{getWordCount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Characters:</span>
                  <span className="font-semibold">{getCharacterCount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="font-semibold">{textTypes[textType].name}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Text Output */}
          <div className="xl:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Generated Text</CardTitle>
                      <CardDescription>
                        {paragraphs} paragraph{paragraphs !== 1 ? 's' : ''} • {getWordCount()} words • {getCharacterCount()} characters
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadText} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedText}
                  readOnly
                  className="min-h-[500px] resize-none font-mono text-sm leading-relaxed"
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
