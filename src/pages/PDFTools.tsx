
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Image, 
  Minimize, 
  Merge, 
  FileImage,
  ArrowLeft,
  Settings,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { compressPDF, mergePDFs, pdfToImages, pdfToWord } from "@/utils/pdfUtils";

const PDFTools = () => {
  const [activeTab, setActiveTab] = useState("pdf-to-image");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');
  const [imageDPI, setImageDPI] = useState(300);
  const { toast } = useToast();

  const pdfTools = [
    {
      id: "pdf-to-image",
      title: "PDF to Image",
      description: "Convert PDF pages to high-quality images (PNG, JPG)",
      icon: FileImage,
      gradient: "from-blue-500 to-blue-600",
      features: ["High-quality conversion", "Multiple formats", "Batch processing", "Custom DPI settings"]
    },
    {
      id: "compress-pdf",
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      icon: Minimize,
      gradient: "from-green-500 to-green-600",
      features: ["Smart compression", "Quality preservation", "Size optimization", "Batch processing"]
    },
    {
      id: "merge-pdf",
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document",
      icon: Merge,
      gradient: "from-purple-500 to-purple-600",
      features: ["Multiple files", "Custom order", "Page selection", "Fast processing"]
    },
    {
      id: "pdf-to-word",
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word files",
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
      features: ["Editable output", "Layout preservation", "Text recognition", "Format retention"]
    }
  ];

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
    setProcessedResult(null);
    
    if (files.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) ready for processing`,
      });
    }
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload PDF files first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessedResult(null);
    
    try {
      let result;
      
      console.log(`Starting ${activeTab} processing for ${uploadedFiles.length} file(s)`);
      
      switch (activeTab) {
        case "pdf-to-image":
          if (uploadedFiles.length === 0) {
            throw new Error("No file selected for conversion");
          }
          console.log(`Converting PDF to ${imageFormat} at ${imageDPI} DPI`);
          result = await pdfToImages(uploadedFiles[0], imageFormat, imageDPI);
          console.log(`Successfully converted ${result.length} pages to images`);
          break;
          
        case "compress-pdf":
          if (uploadedFiles.length === 0) {
            throw new Error("No file selected for compression");
          }
          console.log(`Compressing PDF with ${compressionLevel} quality`);
          result = await compressPDF(uploadedFiles[0], compressionLevel);
          console.log("PDF compressed successfully");
          break;
          
        case "merge-pdf":
          if (uploadedFiles.length < 2) {
            toast({
              title: "Multiple files required",
              description: "Please upload at least 2 PDF files to merge",
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }
          console.log(`Merging ${uploadedFiles.length} PDF files`);
          result = await mergePDFs(uploadedFiles);
          console.log("PDFs merged successfully");
          break;
          
        case "pdf-to-word":
          if (uploadedFiles.length === 0) {
            throw new Error("No file selected for conversion");
          }
          console.log("Converting PDF to Word document");
          result = await pdfToWord(uploadedFiles[0]);
          console.log("PDF converted to Word successfully");
          break;
          
        default:
          throw new Error(`Unknown tool selected: ${activeTab}`);
      }
      
      setProcessedResult(result);
      toast({
        title: "Processing complete!",
        description: "Your files have been processed successfully",
      });
    } catch (error) {
      console.error("Processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedResult) return;

    if (activeTab === "pdf-to-image" && Array.isArray(processedResult)) {
      // Download images
      processedResult.forEach((imageUrl, index) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `page-${index + 1}.${imageFormat}`;
        link.click();
      });
    } else if (processedResult instanceof Blob) {
      // Download PDF or Word file
      const url = URL.createObjectURL(processedResult);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = activeTab === "pdf-to-word" ? "docx" : "pdf";
      link.download = `processed-file.${extension}`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
    
    toast({
      title: "Download started",
      description: "Your processed files are being downloaded",
    });
  };

  const currentTool = pdfTools.find(tool => tool.id === activeTab);
  const requiresMultipleFiles = activeTab === "merge-pdf";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
                  onClick={() => {
                    setActiveTab(tool.id);
                    setUploadedFiles([]);
                    setProcessedResult(null);
                  }}
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
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    multiple={requiresMultipleFiles}
                    maxSize={50}
                  />

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
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={imageFormat}
                            onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
                          >
                            <option value="png">PNG (High Quality)</option>
                            <option value="jpg">JPG (Smaller Size)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Resolution (DPI)</label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={imageDPI}
                            onChange={(e) => setImageDPI(Number(e.target.value))}
                          >
                            <option value={150}>150 DPI (Standard)</option>
                            <option value={300}>300 DPI (High Quality)</option>
                            <option value={600}>600 DPI (Print Quality)</option>
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
                        {(['high', 'medium', 'low'] as const).map((level) => (
                          <div key={level} className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              id={level} 
                              name="compression" 
                              value={level}
                              checked={compressionLevel === level}
                              onChange={(e) => setCompressionLevel(e.target.value as typeof compressionLevel)}
                            />
                            <label htmlFor={level} className="flex-1">
                              <div className="font-medium capitalize">{level} Compression</div>
                              <div className="text-sm text-muted-foreground">
                                {level === 'high' && 'Better quality, larger file'}
                                {level === 'medium' && 'Balanced quality and size'}
                                {level === 'low' && 'Smaller file, reduced quality'}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Process Button */}
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleProcess}
                      disabled={uploadedFiles.length === 0 || isProcessing}
                      className="flex-1 h-12 text-lg"
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
                    
                    {processedResult && (
                      <Button 
                        onClick={handleDownload}
                        variant="outline"
                        className="h-12"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>

                  {/* Results Preview */}
                  {processedResult && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Processing Complete!</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {activeTab === "pdf-to-image" && Array.isArray(processedResult) 
                          ? `Successfully converted ${processedResult.length} pages to images.`
                          : "Your file has been processed successfully."
                        } Click the download button to save.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tool Info & Preview */}
            <div className="space-y-6">
              {/* File Preview */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">File Preview</h3>
                  {uploadedFiles.slice(0, 3).map((file, index) => (
                    <PDFPreview
                      key={index}
                      file={file}
                      isProcessing={isProcessing}
                      onDownload={processedResult ? handleDownload : undefined}
                    />
                  ))}
                  {uploadedFiles.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      And {uploadedFiles.length - 3} more files...
                    </p>
                  )}
                </div>
              )}

              {/* Tool Features */}
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

              {/* Privacy & Security */}
              <Card>
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
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Fast local processing</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFTools;
