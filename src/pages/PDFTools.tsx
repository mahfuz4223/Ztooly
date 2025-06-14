import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Image, 
  Minimize, 
  Merge, 
  FileImage,
  Upload,
  Download,
  ArrowLeft,
  Settings,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PDFTools = () => {
  const [activeTab, setActiveTab] = useState("pdf-to-image");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const pdfTools = [
    {
      id: "pdf-to-image",
      title: "PDF to Image",
      description: "Convert PDF pages to high-quality images (PNG, JPG)",
      icon: FileImage,
      gradient: "from-blue-500 to-blue-600",
      features: ["High-quality conversion", "Multiple formats", "Batch processing"]
    },
    {
      id: "compress-pdf",
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      icon: Minimize,
      gradient: "from-green-500 to-green-600",
      features: ["Smart compression", "Quality preservation", "Size optimization"]
    },
    {
      id: "merge-pdf",
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document",
      icon: Merge,
      gradient: "from-purple-500 to-purple-600",
      features: ["Multiple files", "Custom order", "Page selection"]
    },
    {
      id: "pdf-to-word",
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word files",
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
      features: ["Editable output", "Layout preservation", "Text recognition"]
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for processing`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing complete!",
        description: "Your file has been processed successfully",
      });
    }, 3000);
  };

  const currentTool = pdfTools.find(tool => tool.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">PDF Tools</h1>
                  <p className="text-sm text-muted-foreground">Professional PDF utilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tool Selection */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pdfTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={tool.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    activeTab === tool.id 
                      ? "border-primary shadow-lg bg-primary/5" 
                      : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{tool.title}</CardTitle>
                        <CardDescription className="text-xs">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Tool Interface */}
        {currentTool && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload & Process */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentTool.gradient} rounded-xl flex items-center justify-center`}>
                      <currentTool.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentTool.title}</CardTitle>
                      <CardDescription>{currentTool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upload your PDF file</h3>
                    <p className="text-muted-foreground mb-4">Drag and drop or click to select</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">{uploadedFile.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tool-specific options */}
                  {activeTab === "pdf-to-image" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Conversion Settings
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Output Format</label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option value="png">PNG (High Quality)</option>
                            <option value="jpg">JPG (Smaller Size)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Resolution (DPI)</label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option value="150">150 DPI (Standard)</option>
                            <option value="300">300 DPI (High Quality)</option>
                            <option value="600">600 DPI (Print Quality)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "compress-pdf" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Compression Settings
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input type="radio" id="low" name="compression" defaultChecked />
                          <label htmlFor="low" className="flex-1">
                            <div className="font-medium">Low Compression</div>
                            <div className="text-sm text-muted-foreground">Better quality, larger file</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="radio" id="medium" name="compression" />
                          <label htmlFor="medium" className="flex-1">
                            <div className="font-medium">Medium Compression</div>
                            <div className="text-sm text-muted-foreground">Balanced quality and size</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="radio" id="high" name="compression" />
                          <label htmlFor="high" className="flex-1">
                            <div className="font-medium">High Compression</div>
                            <div className="text-sm text-muted-foreground">Smaller file, reduced quality</div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "merge-pdf" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Merge Settings
                      </h4>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload multiple PDF files to merge them into one document
                        </p>
                        <Button variant="outline" size="sm">
                          Add More Files
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === "pdf-to-word" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Conversion Settings
                      </h4>
                      <div>
                        <label className="block text-sm font-medium mb-2">Output Format</label>
                        <select className="w-full p-2 border rounded-md bg-background">
                          <option value="docx">Word Document (.docx)</option>
                          <option value="doc">Word 97-2003 (.doc)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Process Button */}
                  <Button 
                    onClick={handleProcess}
                    disabled={!uploadedFile || isProcessing}
                    className="w-full h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Start Processing
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tool Info & Features */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Tool Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentTool.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>All processing happens in your browser</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Files are never uploaded to our servers</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Complete privacy and data security</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Demo Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">Simple 3-step process for all PDF tools</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Upload</h3>
              <p className="text-sm text-muted-foreground">Select your PDF file from your device</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Configure</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred settings and options</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Download</h3>
              <p className="text-sm text-muted-foreground">Get your processed files instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
