import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Download, FileText, Braces, Upload, Zap, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CSVToJSONConverter = () => {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      const obj: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      data.push(obj);
    }

    return data;
  };

  const convertToJSON = () => {
    if (!csvInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data to convert",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      const jsonData = parseCSV(csvInput);
      const formattedJSON = JSON.stringify(jsonData, null, 2);
      setJsonOutput(formattedJSON);
      
      toast({
        title: "Success",
        description: "CSV converted to JSON successfully!"
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "Failed to convert CSV to JSON",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput);
    toast({
      title: "Copied!",
      description: "JSON data copied to clipboard"
    });
  };

  const downloadJSON = () => {
    if (!jsonOutput) return;
    
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file downloaded successfully"
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvInput(content);
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    setCsvInput('');
    setJsonOutput('');
  };

  const loadSampleData = () => {
    const sampleCSV = `name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;
    setCsvInput(sampleCSV);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            CSV to JSON Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your CSV data into clean, structured JSON format instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* CSV Input Section */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="h-6 w-6" />
                CSV Input
              </CardTitle>
              <CardDescription className="text-blue-100 text-base">
                Upload a file or paste your CSV data below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => document.getElementById('csv-file')?.click()}
                    className="flex items-center gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload CSV File
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={loadSampleData}
                    className="flex items-center gap-2 border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <FileText className="h-4 w-4" />
                    Load Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={clearAll}
                    className="flex items-center gap-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                </div>

                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* CSV Input Textarea */}
                <div className="space-y-3">
                  <Label htmlFor="csv-input" className="text-base font-medium text-gray-700">
                    CSV Data
                  </Label>
                  <Textarea
                    id="csv-input"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="name,age,city&#10;John Doe,30,New York&#10;Jane Smith,25,Los Angeles"
                    className="min-h-[350px] font-mono text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                  />
                </div>

                {/* Convert Button */}
                <Button 
                  onClick={convertToJSON} 
                  disabled={isConverting || !csvInput.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 shadow-lg disabled:opacity-50"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Convert to JSON
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Output Section */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Braces className="h-6 w-6" />
                JSON Output
              </CardTitle>
              <CardDescription className="text-emerald-100 text-base">
                Your converted JSON data will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={copyToClipboard}
                    disabled={!jsonOutput}
                    className="flex items-center gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={downloadJSON}
                    disabled={!jsonOutput}
                    className="flex items-center gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>

                {/* JSON Output Textarea */}
                <div className="space-y-3">
                  <Label htmlFor="json-output" className="text-base font-medium text-gray-700">
                    JSON Data
                  </Label>
                  <Textarea
                    id="json-output"
                    value={jsonOutput}
                    readOnly
                    placeholder="Your converted JSON will appear here..."
                    className="min-h-[350px] font-mono text-sm bg-gray-50/50 border-gray-200 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-12 shadow-xl border-0 bg-white/70 backdrop-blur-sm max-w-4xl mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Powerful Features
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Everything you need for seamless CSV to JSON conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Easy File Upload</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload CSV files directly from your computer with drag-and-drop support
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Instant Conversion</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time conversion with error handling and validation for clean results
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-3">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Export Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  Copy to clipboard or download as JSON file for immediate use
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSVToJSONConverter;
