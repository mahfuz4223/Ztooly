
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
  Upload,
  AlertCircle,
  RefreshCw
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
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setConvertedImages([]);
      setError('');
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
    setError('');
    
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
      setError(errorMessage);
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
      link.download = `${uploadedFile?.name?.replace('.pdf', '') || 'page'}-${index + 1}.${imageFormat}`;
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
    link.download = `${uploadedFile?.name?.replace('.pdf', '') || 'page'}-${index + 1}.${imageFormat}`;
    link.click();
  };

  const handleRetry = () => {
    setError('');
    handleConvert();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/pdf-tools" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to PDF Tools
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileImage className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PDF to Image Converter
                  </h1>
                  <p className="text-sm text-muted-foreground">Transform PDF pages into high-quality images</p>
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
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileImage className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Convert PDF to Images
                    </CardTitle>
                    <CardDescription className="text-base">
                      Transform your PDF pages into high-quality PNG or JPG images with custom resolution
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    Upload PDF File
                  </h3>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 bg-blue-50/50">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      multiple={false}
                      maxSize={50}
                    />
                  </div>
                </div>

                {/* Conversion Settings */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Conversion Settings
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Output Format</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={imageFormat}
                        onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
                      >
                        <option value="png">PNG (High Quality, Transparent Background)</option>
                        <option value="jpg">JPG (Smaller Size, No Transparency)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Resolution (DPI)</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={imageDPI}
                        onChange={(e) => setImageDPI(Number(e.target.value))}
                      >
                        <option value={150}>150 DPI (Web Quality - Faster)</option>
                        <option value={300}>300 DPI (High Quality - Recommended)</option>
                        <option value={600}>600 DPI (Print Quality - Slower)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleConvert}
                    disabled={!uploadedFile || isProcessing}
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Converting PDF...
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-3" />
                        Convert to Images
                      </>
                    )}
                  </Button>
                  
                  {convertedImages.length > 0 && (
                    <Button 
                      onClick={handleDownloadAll}
                      variant="outline"
                      className="h-14 px-6 border-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download All ({convertedImages.length})
                    </Button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-red-800 mb-1">Conversion Failed</div>
                        <p className="text-sm text-red-700 mb-3">{error}</p>
                        <Button 
                          onClick={handleRetry}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {convertedImages.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-800 text-lg">Conversion Complete!</span>
                    </div>
                    <p className="text-green-700">
                      Successfully converted <strong>{convertedImages.length} pages</strong> to {imageFormat.toUpperCase()} images at {imageDPI} DPI.
                      All images are ready for download below.
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
                <h3 className="font-semibold text-lg">PDF Preview</h3>
                <PDFPreview
                  file={uploadedFile}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Converted Images Preview */}
            {convertedImages.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-blue-500" />
                    Converted Images ({convertedImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {convertedImages.map((imageUrl, index) => (
                      <Card key={index} className="p-4 border border-gray-100">
                        <div className="space-y-3">
                          <img 
                            src={imageUrl} 
                            alt={`Page ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Page {index + 1} • {imageFormat.toUpperCase()}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadSingle(imageUrl, index)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "High-quality image conversion",
                  "Multiple output formats (PNG, JPG)",
                  "Custom DPI settings (150-600)",
                  "Batch download support",
                  "Client-side processing (secure)",
                  "No file size limits"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToImage;
