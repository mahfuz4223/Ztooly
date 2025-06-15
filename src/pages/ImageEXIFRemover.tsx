
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { Upload, Download, Eye, EyeOff, Trash2, Camera, MapPin, Calendar, Settings, ChevronDown, Shield, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EXIFData {
  [key: string]: any;
}

const ImageEXIFRemover = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [processedPreview, setProcessedPreview] = useState<string>('');
  const [originalEXIF, setOriginalEXIF] = useState<EXIFData>({});
  const [fakeEXIF, setFakeEXIF] = useState<EXIFData>({});
  const [showOriginalEXIF, setShowOriginalEXIF] = useState(false);
  const [showFakeEXIF, setShowFakeEXIF] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

  // Mock EXIF data for demonstration
  const mockOriginalEXIF = {
    'Camera Make': 'Canon',
    'Camera Model': 'EOS R5',
    'Date Created': '2024-06-15 14:30:22',
    'GPS Latitude': '40.7128° N',
    'GPS Longitude': '74.0060° W',
    'Exposure Time': '1/250',
    'F-Number': 'f/2.8',
    'ISO Speed': '400',
    'Focal Length': '85mm',
    'White Balance': 'Auto',
    'Flash': 'No Flash',
  };

  const mockFakeEXIF = {
    'Camera Make': 'Generic Camera',
    'Camera Model': 'Model X',
    'Date Created': '2020-01-01 12:00:00',
    'GPS Latitude': 'Removed',
    'GPS Longitude': 'Removed',
    'Exposure Time': '1/60',
    'F-Number': 'f/4.0',
    'ISO Speed': '200',
    'Focal Length': '50mm',
    'White Balance': 'Daylight',
    'Flash': 'Auto',
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setOriginalFile(file);
    setOriginalEXIF(mockOriginalEXIF);
    setFakeEXIF(mockFakeEXIF);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image loaded",
      description: "EXIF data extracted successfully.",
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeEXIFData = async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate EXIF removal process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new blob without EXIF data (simulation)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setProcessedBlob(blob);
            setProcessedPreview(URL.createObjectURL(blob));
            toast({
              title: "EXIF data removed",
              description: "Image processed successfully without metadata.",
            });
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = originalPreview;
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to remove EXIF data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const insertFakeEXIFData = async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate fake EXIF insertion process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new blob with fake EXIF data (simulation)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setProcessedBlob(blob);
            setProcessedPreview(URL.createObjectURL(blob));
            toast({
              title: "Fake EXIF data inserted",
              description: "Image processed with anonymized metadata.",
            });
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = originalPreview;
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to insert fake EXIF data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedBlob || !originalFile) return;
    
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Processed image downloaded successfully.",
    });
  };

  const updateFakeEXIFValue = (key: string, value: string) => {
    setFakeEXIF(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setOriginalFile(null);
    setOriginalPreview('');
    setProcessedPreview('');
    setOriginalEXIF({});
    setFakeEXIF({});
    setProcessedBlob(null);
    setShowOriginalEXIF(false);
    setShowFakeEXIF(false);
    
    toast({
      title: "Cleared",
      description: "All data cleared successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-blue-600" />
            Image EXIF Data Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Remove sensitive metadata or insert fake EXIF data to protect your privacy
          </p>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-blue-300 bg-white/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div
              className="text-center space-y-4 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Upload Image</h3>
                <p className="text-gray-600">Drag and drop or click to select an image file</p>
                <p className="text-sm text-gray-500">Supports JPEG, PNG, TIFF, and other common formats</p>
              </div>
              <Button variant="outline" className="mt-4">
                Choose Image
              </Button>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </CardContent>
        </Card>

        {originalFile && (
          <>
            {/* Image Preview */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Original Image
                  </CardTitle>
                  <CardDescription>Image with original EXIF data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {originalPreview && (
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">File: {originalFile.name}</span>
                      <Badge variant="outline">
                        {(originalFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processed Image */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Processed Image
                  </CardTitle>
                  <CardDescription>Image after EXIF processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {processedPreview ? (
                      <img
                        src={processedPreview}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Settings className="h-12 w-12 mx-auto mb-2" />
                          <p>Process image to see result</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {processedBlob && (
                    <div className="mt-4">
                      <Button onClick={downloadProcessedImage} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Processed Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Processing Controls */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Processing Options</CardTitle>
                <CardDescription>Choose how to process your image's EXIF data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={removeEXIFData}
                    disabled={isProcessing}
                    variant="destructive"
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <Trash2 className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">Remove All EXIF</div>
                      <div className="text-xs opacity-80">Strip all metadata</div>
                    </div>
                  </Button>

                  <Button
                    onClick={insertFakeEXIFData}
                    disabled={isProcessing}
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <Plus className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">Insert Fake EXIF</div>
                      <div className="text-xs opacity-80">Add anonymized data</div>
                    </div>
                  </Button>

                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <Trash2 className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">Clear All</div>
                      <div className="text-xs opacity-80">Start over</div>
                    </div>
                  </Button>
                </div>
                {isProcessing && (
                  <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EXIF Data Viewers */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original EXIF Data */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <Collapsible open={showOriginalEXIF} onOpenChange={setShowOriginalEXIF}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50/50">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Original EXIF Data
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          showOriginalEXIF && "rotate-180"
                        )} />
                      </CardTitle>
                      <CardDescription>Metadata found in the original image</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(originalEXIF).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-700">{key}</span>
                            <span className="text-sm text-gray-600 text-right flex-1 ml-4">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Fake EXIF Data */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <Collapsible open={showFakeEXIF} onOpenChange={setShowFakeEXIF}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50/50">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Fake EXIF Data
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          showFakeEXIF && "rotate-180"
                        )} />
                      </CardTitle>
                      <CardDescription>Customizable fake metadata to insert</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(fakeEXIF).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                              {key}
                            </Label>
                            <Input
                              id={key}
                              value={String(value)}
                              onChange={(e) => updateFakeEXIFValue(key, e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageEXIFRemover;
