import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileJson, 
  Check,
  Copy,
  Download,
  Upload,
  AlertCircle,
  Zap,
  Settings,
  Code,
  FileText,
  Table,
  Minimize,
  Maximize,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTextToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

const JSONTools = () => {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");  const [indentSize, setIndentSize] = useState("2");
  const { toast } = useToast();

  // Initialize analytics
  const analytics = useTextToolAnalytics('json-tools', 'JSON Tools');

  const validateJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString);
      setIsValid(true);
      setError("");
      return true;
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      return false;
    }
  };
  const formatJson = () => {
    // Track format action
    analytics.trackGenerate();
    
    if (!inputJson.trim()) {
      toast({
        title: "No input",
        description: "Please enter JSON to format",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize));
      setOutputJson(formatted);
      setIsValid(true);
      setError("");
      toast({
        title: "JSON formatted successfully",
        description: "Your JSON has been formatted",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid JSON";
      setError(errorMsg);
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };
  const minifyJson = () => {
    // Track minify action
    analytics.trackGenerate();
    
    if (!inputJson.trim()) {
      toast({
        title: "No input",
        description: "Please enter JSON to minify",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setIsValid(true);
      setError("");
      toast({
        title: "JSON minified successfully",
        description: "Your JSON has been minified",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid JSON";
      setError(errorMsg);
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const validateJsonOnly = () => {
    if (!inputJson.trim()) {
      toast({
        title: "No input",
        description: "Please enter JSON to validate",
        variant: "destructive",
      });
      return;
    }

    const valid = validateJson(inputJson);
    if (valid) {
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid",
      });
    } else {
      toast({
        title: "Invalid JSON",
        description: error,
        variant: "destructive",
      });
    }
  };

  const convertToCSV = () => {
    if (!inputJson.trim()) {
      toast({
        title: "No input",
        description: "Please enter JSON to convert",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of objects for CSV conversion");
      }

      if (parsed.length === 0) {
        setOutputJson("");
        return;
      }

      const headers = Object.keys(parsed[0]);
      const csvHeaders = headers.join(",");
      const csvRows = parsed.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      );

      const csv = [csvHeaders, ...csvRows].join("\n");
      setOutputJson(csv);
      
      toast({
        title: "Converted to CSV",
        description: "Your JSON has been converted to CSV format",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Conversion failed";
      setError(errorMsg);
      toast({
        title: "Conversion failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Track copy action
      analytics.trackCopy();
      
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    // Track download action
    analytics.trackDownload();
    
    toast({
      title: "Download started",
      description: `${filename} is being downloaded`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputJson(content);
      validateJson(content);
      
      // Track file upload
      analytics.trackUpload();
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    setInputJson("");
    setOutputJson("");
    setIsValid(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Removed local header/nav - use global nav only */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Tool Interface */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileJson className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      JSON Processor
                    </CardTitle>
                    <CardDescription className="text-base">
                      Format, validate, minify, and convert your JSON data with powerful tools
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="format" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="format">Format</TabsTrigger>
                    <TabsTrigger value="validate">Validate</TabsTrigger>
                    <TabsTrigger value="minify">Minify</TabsTrigger>
                    <TabsTrigger value="convert">Convert</TabsTrigger>
                  </TabsList>

                  <TabsContent value="format" className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="indent">Indentation:</Label>
                      <Select value={indentSize} onValueChange={setIndentSize}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 spaces</SelectItem>
                          <SelectItem value="4">4 spaces</SelectItem>
                          <SelectItem value="8">8 spaces</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={formatJson} className="bg-emerald-500 hover:bg-emerald-600">
                        <Code className="h-4 w-4 mr-2" />
                        Format JSON
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="validate" className="space-y-4">
                    <Button onClick={validateJsonOnly} className="bg-blue-500 hover:bg-blue-600">
                      <Check className="h-4 w-4 mr-2" />
                      Validate JSON
                    </Button>
                  </TabsContent>

                  <TabsContent value="minify" className="space-y-4">
                    <Button onClick={minifyJson} className="bg-orange-500 hover:bg-orange-600">
                      <Minimize className="h-4 w-4 mr-2" />
                      Minify JSON
                    </Button>
                  </TabsContent>

                  <TabsContent value="convert" className="space-y-4">
                    <div className="flex gap-4">
                      <Button onClick={convertToCSV} className="bg-purple-500 hover:bg-purple-600">
                        <Table className="h-4 w-4 mr-2" />
                        Convert to CSV
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note: JSON must be an array of objects for CSV conversion
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="input" className="text-lg font-semibold">Input JSON</Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="input"
                    placeholder="Paste your JSON here..."
                    value={inputJson}
                    onChange={(e) => {
                      setInputJson(e.target.value);
                      if (e.target.value.trim()) {
                        validateJson(e.target.value);
                      }
                    }}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                {/* Status */}
                {inputJson && (
                  <div className={`p-4 rounded-lg border ${
                    isValid 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isValid ? (
                        <>
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Valid JSON</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="font-medium">Invalid JSON</span>
                        </>
                      )}
                    </div>
                    {error && <p className="text-sm mt-1">{error}</p>}
                  </div>
                )}

                {/* Output Section */}
                {outputJson && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Output</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(outputJson)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(outputJson, 'output.json', 'application/json')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={outputJson}
                      readOnly
                      className="min-h-[200px] font-mono text-sm bg-gray-50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={formatJson}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Format JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={minifyJson}
                >
                  <Minimize className="h-4 w-4 mr-2" />
                  Minify JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={validateJsonOnly}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Validate JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={convertToCSV}
                >
                  <Table className="h-4 w-4 mr-2" />
                  Convert to CSV
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "JSON formatting with custom indentation",
                  "Real-time validation with error details",
                  "JSON minification for optimization",
                  "Convert JSON arrays to CSV",
                  "File upload and download support",
                  "Copy to clipboard functionality",
                  "Syntax error highlighting"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tips & Tricks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Use Ctrl+A to select all text in the input area</span>
                </div>
                <div className="flex items-start gap-3">
                  <Maximize className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Format JSON to make it readable and easier to debug</span>
                </div>
                <div className="flex items-start gap-3">
                  <Table className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>For CSV conversion, ensure your JSON is an array of objects</span>
                </div>
                <div className="flex items-start gap-3">
                  <Copy className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Use the copy button to quickly copy formatted results</span>
                </div>
              </CardContent>
            </Card>          </div>
        </div>
        
        {/* Usage Statistics */}
        <UsageStats toolId="json-tools" />
      </div>
    </div>
  );
};

export default JSONTools;
