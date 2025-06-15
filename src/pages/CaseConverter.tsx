
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Type, Download } from "lucide-react";
import { toast } from "sonner";

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

  const convertText = (text: string) => {
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
    { key: 'uppercase', label: 'UPPERCASE', description: 'ALL CHARACTERS IN UPPERCASE' },
    { key: 'lowercase', label: 'lowercase', description: 'all characters in lowercase' },
    { key: 'titleCase', label: 'Title Case', description: 'First Letter Of Each Word Capitalized' },
    { key: 'camelCase', label: 'camelCase', description: 'firstWordLowerFollowingWordsUpper' },
    { key: 'pascalCase', label: 'PascalCase', description: 'FirstLetterOfEachWordCapitalized' },
    { key: 'snakeCase', label: 'snake_case', description: 'words_separated_by_underscores' },
    { key: 'kebabCase', label: 'kebab-case', description: 'words-separated-by-hyphens' },
    { key: 'sentenceCase', label: 'Sentence case', description: 'First letter capitalized, rest lowercase' },
    { key: 'alternatingCase', label: 'aLtErNaTiNg CaSe', description: 'aLtErNaTiNg BeTwEeN cAsEs' },
    { key: 'inverseCase', label: 'iNVERSE cASE', description: 'oPPOSITE oF oRIGINAL cASE' }
  ];

  const stats = {
    characters: inputText.length,
    charactersNoSpaces: inputText.replace(/\s/g, '').length,
    words: inputText.trim().split(/\s+/).filter(word => word.length > 0).length,
    sentences: inputText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
    paragraphs: inputText.split(/\n\s*\n/).filter(para => para.trim().length > 0).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Page Title Section */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-sm">
                <Type className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Case Converter</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Transform text between different case formats</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={downloadAsText}
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-gray-50 transition-colors"
                disabled={!inputText.trim()}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-gray-50 transition-colors"
                disabled={!inputText.trim()}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Type className="h-5 w-5 text-purple-600" />
                  Input Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here to convert between different cases..."
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="min-h-[200px] resize-none border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
                
                {/* Statistics */}
                {inputText && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.characters}</div>
                      <div className="text-xs text-gray-500">Characters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
                      <div className="text-xs text-gray-500">Words</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Converted Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseTypes.map((type) => (
                    <div key={type.key} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-medium">
                            {type.label}
                          </Badge>
                          <span className="text-xs text-gray-500 hidden sm:inline">
                            {type.description}
                          </span>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(results[type.key as keyof typeof results], type.label)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                          disabled={!results[type.key as keyof typeof results]}
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[50px] flex items-center">
                        <code className="text-sm text-gray-700 break-all">
                          {results[type.key as keyof typeof results] || "Enter text to see conversion..."}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
