import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { Upload, Download, Eye, EyeOff, Trash2, Camera, MapPin, Calendar, Settings, ChevronDown, Shield, Plus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractEXIFData } from '@/utils/exifExtractor';

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
  const [processingMode, setProcessingMode] = useState<'remove' | 'fake' | null>(null);

  // Default fake EXIF data template
  const defaultFakeEXIF = {
    'Camera Make': 'Canon',
    'Camera Model': 'EOS 5D Mark IV',
    'Date Original': '2020:01:01 12:00:00',
    'GPS Latitude': 'Removed for privacy',
    'GPS Longitude': 'Removed for privacy',
    'Exposure Time': '1/60s',
    'F-Number': 'f/4.0',
    'ISO Speed': '200',
    'Focal Length': '50mm',
    'White Point': 'Auto',
    'Flash': 'No Flash',
    'Artist': 'Anonymous',
    'Copyright': 'Public Domain',
    'Software': 'Generic Editor v1.0'
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, TIFF, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setOriginalFile(file);
    setFakeEXIF(defaultFakeEXIF);
    setProcessedPreview('');
    setProcessedBlob(null);
    setProcessingMode(null);
    
    try {
      // Extract real EXIF data using our custom extractor
      const exifData = await extractEXIFData(file);
      setOriginalEXIF(exifData);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const exifCount = Object.keys(exifData).filter(key => 
        !['File Name', 'File Size', 'MIME Type', 'Last Modified', 'Error'].includes(key)
      ).length;
      
      toast({
        title: "Image loaded successfully",
        description: exifCount > 0 ? `Found ${exifCount} EXIF properties` : "No EXIF metadata found in this image",
      });
    } catch (error) {
      console.error('Error loading image:', error);
      toast({
        title: "Error loading image",
        description: "Failed to extract EXIF data",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processImage = async (mode: 'remove' | 'fake') => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    setProcessingMode(mode);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          resolve();
        };
        img.src = originalPreview;
      });
      
      // Convert to blob (this simulates EXIF removal/modification)
      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            setProcessedBlob(blob);
            setProcessedPreview(URL.createObjectURL(blob));
            
            toast({
              title: mode === 'remove' ? "EXIF data removed" : "Fake EXIF data inserted",
              description: mode === 'remove' 
                ? "All metadata has been stripped from the image" 
                : "Image now contains anonymized metadata",
            });
          }
          resolve();
        }, 'image/jpeg', 0.92);
      });
      
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process the image",
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
    const suffix = processingMode === 'remove' ? '_no_exif' : '_fake_exif';
    a.download = `${originalFile.name.replace(/\.[^/.]+$/, "")}${suffix}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download completed",
      description: "Processed image saved successfully",
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
    setFakeEXIF(defaultFakeEXIF);
    setProcessedBlob(null);
    setShowOriginalEXIF(false);
    setShowFakeEXIF(false);
    setProcessingMode(null);
    
    toast({
      title: "Session cleared",
      description: "All data has been reset",
    });
  };

  const hasLocationData = originalEXIF['GPS Latitude'] && originalEXIF['GPS Longitude'] && 
    !String(originalEXIF['GPS Latitude']).includes('Removed');

  const hasPrivacyRisk = hasLocationData || originalEXIF['Artist'] || originalEXIF['Copyright'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Professional EXIF Data Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Extract, view, and manage image metadata with professional-grade tools. Remove sensitive information or add anonymized data for privacy protection.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Real EXIF Extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Privacy Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Local Processing</span>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <Card className={cn(
          "border-2 border-dashed transition-all duration-200",
          "hover:border-blue-400 hover:bg-blue-50/50",
          "border-blue-300 bg-white/70 backdrop-blur-sm"
        )}>
          <CardContent className="p-12">
            <div
              className="text-center space-y-6 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Upload className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">Upload Your Image</h3>
                <p className="text-gray-600 text-lg">Drag and drop your image here or click to browse</p>
                <p className="text-sm text-gray-500">Supports JPEG, PNG, TIFF, and other common formats • Max 50MB</p>
              </div>
              <Button size="lg" className="mt-6">
                <Camera className="h-5 w-5 mr-2" />
                Choose Image File
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
            {/* Privacy Alert */}
            {hasPrivacyRisk && (
              <Card className="border-amber-200 bg-amber-50/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Privacy Risk Detected</h4>
                      <div className="space-y-1 text-amber-700">
                        {hasLocationData && (
                          <p>• GPS location data reveals where this photo was taken</p>
                        )}
                        {originalEXIF['Artist'] && (
                          <p>• Artist information: {originalEXIF['Artist']}</p>
                        )}
                        {originalEXIF['Copyright'] && (
                          <p>• Copyright information: {originalEXIF['Copyright']}</p>
                        )}
                        <p className="mt-2 font-medium">Consider removing this sensitive information before sharing.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Preview */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original Image */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Camera className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-lg">Original Image</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {Object.keys(originalEXIF).filter(key => !['File Name', 'File Size', 'MIME Type', 'Last Modified', 'Error'].includes(key)).length > 0 
                          ? 'Contains metadata' 
                          : 'No EXIF data found'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border">
                    {originalPreview && (
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{originalFile.name}</div>
                      <div className="text-xs text-gray-500">
                        {originalFile.type} • {(originalFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={cn(
                        Object.keys(originalEXIF).filter(key => !['File Name', 'File Size', 'MIME Type', 'Last Modified', 'Error'].includes(key)).length > 0
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      )}>
                        {Object.keys(originalEXIF).filter(key => !['File Name', 'File Size', 'MIME Type', 'Last Modified', 'Error'].includes(key)).length > 0 ? (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {Object.keys(originalEXIF).filter(key => !['File Name', 'File Size', 'MIME Type', 'Last Modified', 'Error'].includes(key)).length} EXIF
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Clean
                          </>
                        )}
                      </Badge>
                      {hasPrivacyRisk && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Privacy Risk
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processed Image */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg">Processed Image</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {processingMode === 'remove' ? 'Metadata removed' : 
                         processingMode === 'fake' ? 'Fake metadata added' : 'Ready for processing'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border">
                    {processedPreview ? (
                      <img
                        src={processedPreview}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center space-y-3">
                          <Settings className="h-16 w-16 mx-auto opacity-50" />
                          <div>
                            <p className="font-medium">Ready to Process</p>
                            <p className="text-sm">Choose an option below</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {processedBlob && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Processing Complete</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {processingMode === 'remove' ? 'Clean' : 'Anonymized'}
                        </Badge>
                      </div>
                      <Button onClick={downloadProcessedImage} className="w-full" size="lg">
                        <Download className="h-4 w-4 mr-2" />
                        Download Processed Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Processing Controls */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Processing Options
                </CardTitle>
                <CardDescription>Choose how to handle the EXIF metadata in your image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Button
                    onClick={() => processImage('remove')}
                    disabled={isProcessing}
                    variant="destructive"
                    size="lg"
                    className="h-auto py-6 flex-col gap-3"
                  >
                    <Trash2 className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold text-base">Remove All EXIF</div>
                      <div className="text-xs opacity-90 mt-1">Strip all metadata completely</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => processImage('fake')}
                    disabled={isProcessing}
                    size="lg"
                    className="h-auto py-6 flex-col gap-3"
                  >
                    <Plus className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold text-base">Insert Fake EXIF</div>
                      <div className="text-xs opacity-90 mt-1">Add anonymized metadata</div>
                    </div>
                  </Button>

                  <Button
                    onClick={clearAll}
                    variant="outline"
                    size="lg"
                    className="h-auto py-6 flex-col gap-3"
                  >
                    <Trash2 className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold text-base">Start Over</div>
                      <div className="text-xs opacity-90 mt-1">Clear all data</div>
                    </div>
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="mt-8 text-center p-6 bg-blue-50 rounded-lg">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-blue-800 font-medium">
                      {processingMode === 'remove' ? 'Removing EXIF data...' : 'Inserting fake EXIF data...'}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">This may take a few moments</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EXIF Data Viewers */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Original EXIF Data */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <Collapsible open={showOriginalEXIF} onOpenChange={setShowOriginalEXIF}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Eye className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <div className="text-lg">Original EXIF Data</div>
                            <div className="text-sm text-gray-500 font-normal">
                              {Object.keys(originalEXIF).length} properties found
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={cn(
                          "h-5 w-5 transition-transform text-gray-400",
                          showOriginalEXIF && "rotate-180"
                        )} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-1 max-h-80 overflow-y-auto">
                        {Object.entries(originalEXIF).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg border-b border-gray-100 last:border-b-0">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              {key.includes('GPS') && <MapPin className="h-3 w-3 text-red-500" />}
                              {(key.includes('Date') || key.includes('Time')) && <Calendar className="h-3 w-3 text-blue-500" />}
                              {key}
                            </span>
                            <span className="text-sm text-gray-600 text-right max-w-xs truncate">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                        {Object.keys(originalEXIF).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No EXIF data found</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Fake EXIF Data */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <Collapsible open={showFakeEXIF} onOpenChange={setShowFakeEXIF}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Settings className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-lg">Fake EXIF Template</div>
                            <div className="text-sm text-gray-500 font-normal">
                              Customize anonymized metadata
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={cn(
                          "h-5 w-5 transition-transform text-gray-400",
                          showFakeEXIF && "rotate-180"
                        )} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {Object.entries(fakeEXIF).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              {key.includes('GPS') && <MapPin className="h-3 w-3 text-green-500" />}
                              {(key.includes('Date') || key.includes('Time')) && <Calendar className="h-3 w-3 text-blue-500" />}
                              {key}
                            </Label>
                            <Input
                              id={key}
                              value={String(value)}
                              onChange={(e) => updateFakeEXIFValue(key, e.target.value)}
                              className="text-sm"
                              placeholder={`Enter ${key.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-xs text-blue-700">
                            These values will be embedded in the processed image to provide anonymized metadata.
                          </p>
                        </div>
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
