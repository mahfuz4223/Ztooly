import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Type, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTextToolAnalytics } from "@/utils/analyticsHelper";
import { UsageStats } from "@/components/UsageStats";

const CaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState({
    uppercase: "",
    lowercase: "",
    titleCase: "",
    camelCase: "",
    pascalCase: "",
    snakeCase: "",
    kebabCase: "",
    sentenceCase: "",
    alternatingCase: "",
    inverseCase: ""
  });
  // Initialize analytics
  const analytics = useTextToolAnalytics('case-converter', 'Case Converter');

  const convertText = (text: string) => {
    // Track conversion action
    analytics.trackConvert();

    const uppercase = text.toUpperCase();
    const lowercase = text.toLowerCase();
    
    const titleCase = text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    
    const camelCase = text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
    
    const pascalCase = text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
    
    const snakeCase = text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
    
    const kebabCase = text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
    
    const sentenceCase = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    
    const alternatingCase = text
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
    
    const inverseCase = text
      .split('')
      .map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');

    setResults({
      uppercase,
      lowercase,
      titleCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      sentenceCase,
      alternatingCase,
      inverseCase
    });
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim()) {
      convertText(value);
    } else {
      setResults({
        uppercase: "",
        lowercase: "",
        titleCase: "",
        camelCase: "",
        pascalCase: "",
        snakeCase: "",
        kebabCase: "",
        sentenceCase: "",
        alternatingCase: "",
        inverseCase: ""
      });
    }
  };
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      analytics.trackCopy(); // Track copy action
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const clearAll = () => {
    setInputText("");
    setResults({
      uppercase: "",
      lowercase: "",
      titleCase: "",
      camelCase: "",
      pascalCase: "",
      snakeCase: "",
      kebabCase: "",
      sentenceCase: "",
      alternatingCase: "",
      inverseCase: ""
    });
    toast.success("All text cleared!");
  };

  const downloadAsText = () => {
    const content = `Input Text: ${inputText}\n\n` +
      `UPPERCASE: ${results.uppercase}\n` +
      `lowercase: ${results.lowercase}\n` +
      `Title Case: ${results.titleCase}\n` +
      `camelCase: ${results.camelCase}\n` +
      `PascalCase: ${results.pascalCase}\n` +
      `snake_case: ${results.snakeCase}\n` +
      `kebab-case: ${results.kebabCase}\n` +
      `Sentence case: ${results.sentenceCase}\n` +
      `aLtErNaTiNg CaSe: ${results.alternatingCase}\n` +
      `iNVERSE cASE: ${results.inverseCase}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case-converted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const caseTypes = [
    { key: 'uppercase', label: 'UPPERCASE', description: 'All characters in uppercase', icon: "🔠" },
    { key: 'lowercase', label: 'lowercase', description: 'All characters in lowercase', icon: "🔡" },
    { key: 'titleCase', label: 'Title Case', description: 'First letter of each word capitalized', icon: "📝" },
    { key: 'camelCase', label: 'camelCase', description: 'First word lower, following words upper', icon: "🐪" },
    { key: 'pascalCase', label: 'PascalCase', description: 'First letter of each word capitalized', icon: "🏛️" },
    { key: 'snakeCase', label: 'snake_case', description: 'Words separated by underscores', icon: "🐍" },
    { key: 'kebabCase', label: 'kebab-case', description: 'Words separated by hyphens', icon: "🍢" },
    { key: 'sentenceCase', label: 'Sentence case', description: 'First letter capitalized, rest lowercase', icon: "📄" },
    { key: 'alternatingCase', label: 'aLtErNaTiNg CaSe', description: 'Alternating between cases', icon: "🔀" },
    { key: 'inverseCase', label: 'iNVERSE cASE', description: 'Opposite of original case', icon: "🔄" }
  ];

  const stats = {
    characters: inputText.length,
    charactersNoSpaces: inputText.replace(/\s/g, '').length,
    words: inputText.trim().split(/\s+/).filter(word => word.length > 0).length,
    sentences: inputText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
    paragraphs: inputText.split(/\n\s*\n/).filter(para => para.trim().length > 0).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
              <Type className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Case Converter</h1>
          </div>
          <p className="text-gray-600 text-lg">Transform your text between different case formats instantly</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Input Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Enter your text here to convert between different cases..."
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="min-h-[250px] resize-none border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200 text-base"
                />
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-gray-50 transition-colors flex-1"
                    disabled={!inputText.trim()}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={downloadAsText}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-gray-50 transition-colors flex-1"
                    disabled={!inputText.trim()}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                {/* Statistics */}
                {inputText && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.characters}</div>
                      <div className="text-sm text-gray-600">Characters</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="xl:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Type className="h-6 w-6 text-blue-600" />
                  Converted Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caseTypes.map((type) => (
                    <div key={type.key} className="group relative">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{type.icon}</span>
                            <Badge variant="outline" className="text-sm font-medium bg-white">
                              {type.label}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(results[type.key as keyof typeof results], type.label)}
                            variant="ghost"
                            size="sm"
                            className="opacity-60 group-hover:opacity-100 transition-opacity gap-1 text-gray-600 hover:text-gray-900"
                            disabled={!results[type.key as keyof typeof results]}
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{type.description}</div>
                        <div className="p-3 bg-white rounded-lg border min-h-[60px] flex items-center">
                          <code className="text-sm text-gray-800 break-all leading-relaxed font-mono">
                            {results[type.key as keyof typeof results] || "Enter text to see conversion..."}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <UsageStats toolId="case-converter" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
