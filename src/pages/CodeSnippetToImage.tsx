import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Copy, Code, Zap } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';

const CodeSnippetToImage = () => {
  const [code, setCode] = useState(`function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our app, \${name}\`;
}

const user = "Developer";
greetUser(user);`);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [title, setTitle] = useState('My Code Snippet');
  const codeRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' }
  ];

  const themes = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'github', label: 'GitHub' }
  ];

  // Auto language detection function
  const detectLanguage = (codeText: string): string => {
    const trimmedCode = codeText.trim().toLowerCase();
    
    // JavaScript/TypeScript patterns
    if (trimmedCode.includes('function') || trimmedCode.includes('=>') || 
        trimmedCode.includes('const ') || trimmedCode.includes('let ') ||
        trimmedCode.includes('var ') || trimmedCode.includes('console.log')) {
      if (trimmedCode.includes(': string') || trimmedCode.includes(': number') ||
          trimmedCode.includes('interface ') || trimmedCode.includes('type ')) {
        return 'typescript';
      }
      return 'javascript';
    }
    
    // Python patterns
    if (trimmedCode.includes('def ') || trimmedCode.includes('import ') ||
        trimmedCode.includes('print(') || trimmedCode.includes('if __name__') ||
        trimmedCode.includes('class ') && trimmedCode.includes(':')) {
      return 'python';
    }
    
    // Java patterns
    if (trimmedCode.includes('public class') || trimmedCode.includes('public static void main') ||
        trimmedCode.includes('system.out.print') || trimmedCode.includes('import java.')) {
      return 'java';
    }
    
    // C++ patterns
    if (trimmedCode.includes('#include') || trimmedCode.includes('std::') ||
        trimmedCode.includes('cout <<') || trimmedCode.includes('int main()')) {
      return 'cpp';
    }
    
    // HTML patterns
    if (trimmedCode.includes('<html') || trimmedCode.includes('<!doctype') ||
        trimmedCode.includes('<div') || trimmedCode.includes('<body')) {
      return 'html';
    }
    
    // CSS patterns
    if (trimmedCode.includes('{') && trimmedCode.includes('}') &&
        (trimmedCode.includes('color:') || trimmedCode.includes('margin:') ||
         trimmedCode.includes('padding:') || trimmedCode.includes('font-'))) {
      return 'css';
    }
    
    // JSON patterns
    if ((trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
        (trimmedCode.startsWith('[') && trimmedCode.endsWith(']'))) {
      try {
        JSON.parse(codeText);
        return 'json';
      } catch (e) {
        // Not valid JSON
      }
    }
    
    // SQL patterns
    if (trimmedCode.includes('select ') || trimmedCode.includes('insert into') ||
        trimmedCode.includes('update ') || trimmedCode.includes('delete from') ||
        trimmedCode.includes('create table')) {
      return 'sql';
    }
    
    // Bash patterns
    if (trimmedCode.includes('#!/bin/bash') || trimmedCode.includes('echo ') ||
        trimmedCode.includes('chmod ') || trimmedCode.includes('grep ')) {
      return 'bash';
    }
    
    return language; // Return current language if no pattern matches
  };

  const autoDetectLanguage = () => {
    const detectedLang = detectLanguage(code);
    setLanguage(detectedLang);
    toast.success(`Language detected: ${languages.find(l => l.value === detectedLang)?.label}`);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          codeBackground: '#ffffff',
          textColor: '#1e293b',
          titleColor: '#334155',
          borderColor: '#e2e8f0'
        };
      case 'monokai':
        return {
          background: 'linear-gradient(135deg, #2d2a2e 0%, #1e1e1e 100%)',
          codeBackground: '#2d2a2e',
          textColor: '#f8f8f2',
          titleColor: '#a9dc76',
          borderColor: '#403e41'
        };
      case 'github':
        return {
          background: 'linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%)',
          codeBackground: '#f6f8fa',
          textColor: '#24292f',
          titleColor: '#0969da',
          borderColor: '#d0d7de'
        };
      default: // dark
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          codeBackground: '#1e293b',
          textColor: '#e2e8f0',
          titleColor: '#60a5fa',
          borderColor: '#334155'
        };
    }
  };

  const getLanguageIcon = (lang: string) => {
    const icons: { [key: string]: string } = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      html: '🌐',
      css: '🎨',
      json: '📋',
      sql: '🗃️',
      bash: '💻'
    };
    return icons[lang] || '📄';
  };

  const downloadImage = async () => {
    if (!codeRef.current) return;

    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_code_snippet.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success("Code snippet image downloaded successfully!");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const copyToClipboard = async () => {
    if (!codeRef.current) return;

    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success("Code snippet copied to clipboard!");
        }
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Failed to copy to clipboard. Please try downloading instead.");
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Code className="h-10 w-10 text-primary" />
          Code Snippet to Image
        </h1>
        <p className="text-muted-foreground text-lg">
          Convert your code snippets into beautiful, shareable images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  placeholder="Enter snippet title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {getLanguageIcon(lang.value)} {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((themeOption) => (
                        <SelectItem key={themeOption.value} value={themeOption.value}>
                          {themeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="code">Code</Label>
                  <Button 
                    onClick={autoDetectLanguage}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Auto Detect
                  </Button>
                </div>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Paste your code here..."
                  className="min-h-[300px] font-mono text-sm mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadImage} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={codeRef}
                className="p-8 rounded-xl shadow-2xl"
                style={{ background: themeStyles.background }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div 
                    className="text-lg font-semibold"
                    style={{ color: themeStyles.titleColor }}
                  >
                    {getLanguageIcon(language)} {title}
                  </div>
                </div>

                {/* Code Block */}
                <div 
                  className="rounded-lg p-6 border"
                  style={{ 
                    backgroundColor: themeStyles.codeBackground,
                    borderColor: themeStyles.borderColor
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-sm font-medium opacity-75"
                      style={{ color: themeStyles.textColor }}
                    >
                      {languages.find(l => l.value === language)?.label}
                    </span>
                  </div>
                  <pre 
                    className="text-sm leading-relaxed overflow-x-auto"
                    style={{ 
                      color: themeStyles.textColor,
                      fontFamily: '"Fira Code", "Monaco", "Consolas", monospace'
                    }}
                  >
                    {code}
                  </pre>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <span 
                    className="text-sm opacity-60"
                    style={{ color: themeStyles.textColor }}
                  >
                    Generated with Code Snippet to Image
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetToImage;
