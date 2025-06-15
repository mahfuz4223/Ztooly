
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Download, FileText, Braces, Upload } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CSV to JSON Converter</h1>
          <p className="text-lg text-gray-600">Convert your CSV data to JSON format with ease</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CSV Input Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Input
              </CardTitle>
              <CardDescription className="text-blue-100">
                Paste your CSV data or upload a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('csv-file')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleData}
                  >
                    Load Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
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

                <div>
                  <Label htmlFor="csv-input">CSV Data</Label>
                  <Textarea
                    id="csv-input"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="name,age,city&#10;John Doe,30,New York&#10;Jane Smith,25,Los Angeles"
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>

                <Button 
                  onClick={convertToJSON} 
                  disabled={isConverting || !csvInput.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isConverting ? "Converting..." : "Convert to JSON"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Output Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-5 w-5" />
                JSON Output
              </CardTitle>
              <CardDescription className="text-green-100">
                Your converted JSON data will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!jsonOutput}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadJSON}
                    disabled={!jsonOutput}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div>
                  <Label htmlFor="json-output">JSON Data</Label>
                  <Textarea
                    id="json-output"
                    value={jsonOutput}
                    readOnly
                    placeholder="Your JSON output will appear here..."
                    className="min-h-[400px] font-mono text-sm bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Upload className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">File Upload</h3>
                  <p className="text-gray-600">Upload CSV files directly from your computer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Copy className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Quick Copy</h3>
                  <p className="text-gray-600">Copy converted JSON to clipboard with one click</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Download</h3>
                  <p className="text-gray-600">Download the converted JSON as a file</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSVToJSONConverter;
