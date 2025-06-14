
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileImage, 
  ArrowLeft,
  Settings,
  Zap,
  CheckCircle,
  Loader2,
  Download,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { pdfToImages } from "@/utils/pdfUtils";

const PDFToImage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');
  const [imageDPI, setImageDPI] = useState(300);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setConvertedImages([]);
      toast({
        title: "PDF uploaded successfully",
        description: "Ready to convert to images",
      });
    }
  };

  const handleConvert = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setConvertedImages([]);
    
    try {
      console.log(`Converting PDF to ${imageFormat} at ${imageDPI} DPI`);
      const images = await pdfToImages(uploadedFile, imageFormat, imageDPI);
      setConvertedImages(images);
      
      toast({
        title: "Conversion complete!",
        description: `Successfully converted ${images.length} pages to images`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Conversion failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    if (convertedImages.length === 0) return;

    convertedImages.forEach((imageUrl, index) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `page-${index + 1}.${imageFormat}`;
      link.click();
    });
    
    toast({
      title: "Download started",
      description: `Downloading ${convertedImages.length} images`,
    });
  };

  const handleDownloadSingle = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `page-${index + 1}.${imageFormat}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/pdf-tools" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to PDF Tools
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileImage className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">PDF to Image</h1>
                  <p className="text-sm text-muted-foreground">Convert PDF pages to high-quality images</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Conversion Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">PDF to Image Converter</CardTitle>
                    <CardDescription>Convert your PDF pages to high-quality PNG or JPG images</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload PDF File
                  </h3>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    multiple={false}
                    maxSize={50}
                  />
                </div>

                {/* Conversion Settings */}
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
                        <option value="png">PNG (High Quality, Transparent)</option>
                        <option value="jpg">JPG (Smaller Size, No Transparency)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Resolution (DPI)</label>
                      <select 
                        className="w-full p-2 border rounded-md bg-background"
                        value={imageDPI}
                        onChange={(e) => setImageDPI(Number(e.target.value))}
                      >
                        <option value={150}>150 DPI (Web Quality)</option>
                        <option value={300}>300 DPI (High Quality)</option>
                        <option value={600}>600 DPI (Print Quality)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleConvert}
                    disabled={!uploadedFile || isProcessing}
                    className="flex-1 h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Convert to Images
                      </>
                    )}
                  </Button>
                  
                  {convertedImages.length > 0 && (
                    <Button 
                      onClick={handleDownloadAll}
                      variant="outline"
                      className="h-12"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download All
                    </Button>
                  )}
                </div>

                {/* Success Message */}
                {convertedImages.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Conversion Complete!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Successfully converted {convertedImages.length} pages to {imageFormat.toUpperCase()} images at {imageDPI} DPI.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Preview */}
            {uploadedFile && (
              <div className="space-y-4">
                <h3 className="font-semibold">PDF Preview</h3>
                <PDFPreview
                  file={uploadedFile}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Converted Images Preview */}
            {convertedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Converted Images ({convertedImages.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {convertedImages.map((imageUrl, index) => (
                    <Card key={index} className="p-3">
                      <div className="space-y-3">
                        <img 
                          src={imageUrl} 
                          alt={`Page ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Page {index + 1}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadSingle(imageUrl, index)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>High-quality image conversion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Multiple output formats (PNG, JPG)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom DPI settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Batch download support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Client-side processing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToImage;
