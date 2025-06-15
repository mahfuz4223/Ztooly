import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileImage, 
  Settings,
  Zap,
  CheckCircle,
  Loader2,
  Download,
  Upload,
  AlertCircle,
  RefreshCw
} from "lucide-react";
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Conversion Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileImage className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Convert PDF to Images
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Transform your PDF pages into high-quality PNG or JPG images with custom resolution
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 sm:space-y-8">
                {/* File Upload */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    Upload PDF File
                  </h3>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 sm:p-6 bg-blue-50/50">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      multiple={false}
                      maxSize={50}
                    />
                  </div>
                </div>

                {/* Conversion Settings */}
                <div className="space-y-5 sm:space-y-6">
                  <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    Conversion Settings
                  </h4>
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Output Format</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        value={imageFormat}
                        onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
                      >
                        <option value="png">PNG (High Quality, Transparent Background)</option>
                        <option value="jpg">JPG (Smaller Size, No Transparency)</option>
                      </select>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Resolution (DPI)</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
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
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    onClick={handleConvert}
                    disabled={!uploadedFile || isProcessing}
                    className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-spin" />
                        Converting PDF...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                        Convert to Images
                      </>
                    )}
                  </Button>
                  
                  {convertedImages.length > 0 && (
                    <Button 
                      onClick={handleDownloadAll}
                      variant="outline"
                      className="h-12 sm:h-14 px-4 sm:px-6 border-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      Download All ({convertedImages.length})
                    </Button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-red-800 mb-0.5 sm:mb-1">Conversion Failed</div>
                        <p className="text-xs sm:text-sm text-red-700 mb-2 sm:mb-3">{error}</p>
                        <Button 
                          onClick={handleRetry}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {convertedImages.length > 0 && (
                  <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      <span className="font-semibold text-green-800 text-base sm:text-lg">Conversion Complete!</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Successfully converted <strong>{convertedImages.length} pages</strong> to {imageFormat.toUpperCase()} images at {imageDPI} DPI.
                      All images are ready for download below.
                    </p>
                  </div>
                )}

                {/* All Images Preview for All Pages */}
                {convertedImages.length > 0 && (
                  <div>
                    <Card className="shadow-lg mt-3 sm:mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                          Converted Images: {convertedImages.length} pages
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Each page as a separate image file (format: {imageFormat.toUpperCase()}, {imageDPI} DPI)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 sm:space-y-4 max-h-[370px] sm:max-h-[500px] overflow-y-auto">
                          {convertedImages.map((imageUrl, index) => (
                            <Card key={index} className="p-3 sm:p-4 border border-gray-100 flex items-start gap-4 sm:gap-6">
                              <img 
                                src={imageUrl} 
                                alt={`Page ${index + 1}`}
                                className="w-20 h-24 sm:w-28 sm:h-36 object-cover rounded-lg border shadow-sm"
                              />
                              <div className="flex flex-col justify-between flex-1 min-w-0">
                                <div>
                                  <div className="text-sm sm:text-base font-medium text-gray-800 truncate">Page {index + 1}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Format: {imageFormat.toUpperCase()}, DPI: {imageDPI}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDownloadSingle(imageUrl, index)}
                                    className="text-xs"
                                  >
                                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Download Page {index + 1}
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 sm:space-y-6 mt-4 lg:mt-0">
            {/* File Preview */}
            {uploadedFile && (
              <div className="space-y-2 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">PDF Preview</h3>
                <PDFPreview
                  file={uploadedFile}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">All PDF pages converted ({convertedImages.length > 0 ? convertedImages.length : "0"} pages)</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">Preview & download each page</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">Custom output format & DPI</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">Client-side, secure, fast</span>
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
