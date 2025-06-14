
import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Scissors, ArrowLeft, Download, Upload, Image as ImageIcon, RefreshCw, Zap, Sparkles,
  Wand2, Crop, RotateCcw, Palette, Layers, FileImage, Grid, Settings, Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProcessingOptions {
  size: 'auto' | 'preview' | 'full' | 'regular' | 'medium' | 'hd' | '4k';
  type: 'auto' | 'person' | 'product' | 'car' | 'animal';
  format: 'auto' | 'png' | 'jpg' | 'zip';
  crop: boolean;
  crop_margin: string;
  scale: string;
  position: 'original' | 'center';
  roi: string;
  bg_color: string;
  bg_image_url: string;
}

const BackgroundRemover = () => {
  const [originalImages, setOriginalImages] = useState<Array<{id: string, file: File, url: string}>>([]);
  const [processedImages, setProcessedImages] = useState<Array<{id: string, url: string, blob: Blob}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    size: 'auto',
    type: 'auto',
    format: 'png',
    crop: false,
    crop_margin: '0',
    scale: '100%',
    position: 'original',
    roi: '0% 0% 100% 100%',
    bg_color: '',
    bg_image_url: ''
  });
  const [qualitySettings, setQualitySettings] = useState({
    edgeSmoothing: 50,
    featherRadius: 0,
    noiseReduction: 30
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const API_KEY = "4EsbZjKKCqTJLcYDwncFihre";

  const handleFileSelect = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }

      if (file.size > 12 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 12MB`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    const newImages = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file)
    }));

    setOriginalImages(prev => [...prev, ...newImages]);
    
    if (newImages.length > 0 && !currentImageId) {
      setCurrentImageId(newImages[0].id);
    }
  }, [currentImageId, toast]);

  const processImage = async (imageId: string) => {
    const image = originalImages.find(img => img.id === imageId);
    if (!image) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentImageId(imageId);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const formData = new FormData();
      formData.append('image_file', image.file);
      formData.append('size', processingOptions.size);
      formData.append('type', processingOptions.type);
      formData.append('format', processingOptions.format);
      
      if (processingOptions.crop) {
        formData.append('crop', 'true');
        formData.append('crop_margin', processingOptions.crop_margin);
      }
      
      if (processingOptions.scale !== '100%') {
        formData.append('scale', processingOptions.scale);
      }
      
      if (processingOptions.bg_color) {
        formData.append('bg_color', processingOptions.bg_color);
      }

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background');
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      
      setProcessedImages(prev => {
        const existing = prev.find(img => img.id === imageId);
        if (existing) {
          URL.revokeObjectURL(existing.url);
          return prev.map(img => img.id === imageId ? { ...img, url: processedUrl, blob } : img);
        }
        return [...prev, { id: imageId, url: processedUrl, blob }];
      });

      toast({
        title: "Background removed successfully!",
        description: "Your image is ready for download",
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Failed to remove background",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const processAllImages = async () => {
    for (const image of originalImages) {
      if (!processedImages.find(p => p.id === image.id)) {
        await processImage(image.id);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const downloadImage = (imageId: string) => {
    const processedImage = processedImages.find(img => img.id === imageId);
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `background-removed-${imageId}.png`;
    link.click();
  };

  const downloadAll = () => {
    processedImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img.id), index * 500);
    });
  };

  const removeImage = (imageId: string) => {
    setOriginalImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) URL.revokeObjectURL(image.url);
      return prev.filter(img => img.id !== imageId);
    });
    
    setProcessedImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) URL.revokeObjectURL(image.url);
      return prev.filter(img => img.id !== imageId);
    });
    
    if (currentImageId === imageId) {
      const remaining = originalImages.filter(img => img.id !== imageId);
      setCurrentImageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const resetAll = () => {
    originalImages.forEach(img => URL.revokeObjectURL(img.url));
    processedImages.forEach(img => URL.revokeObjectURL(img.url));
    setOriginalImages([]);
    setProcessedImages([]);
    setCurrentImageId(null);
    setProgress(0);
  };

  const currentImage = originalImages.find(img => img.id === currentImageId);
  const currentProcessed = processedImages.find(img => img.id === currentImageId);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                AI Background Remover Pro
              </span>
            </div>

            <div className="w-24" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Professional AI Background Removal
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Advanced Background Removal
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              With Pro Tools & Batch Processing
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Remove backgrounds from multiple images with advanced AI, custom settings, and professional editing tools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {originalImages.length === 0 ? (
            /* Upload Area */
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-purple-300 transition-colors">
              <CardContent className="p-12">
                <div
                  className={`text-center space-y-6 ${isDragging ? 'scale-105' : ''} transition-transform`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Upload Your Images</h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop images or click to browse. Supports multiple files. Max size: 12MB each
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Images
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">JPG, PNG, WEBP</p>
                    </div>
                    <div className="text-center">
                      <Layers className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Batch Processing</p>
                    </div>
                    <div className="text-center">
                      <Wand2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">AI Precision</p>
                    </div>
                    <div className="text-center">
                      <Settings className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Advanced Settings</p>
                    </div>
                    <div className="text-center">
                      <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">HD Downloads</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Processing Interface */
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Settings Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Pro Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="processing" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="processing">AI</TabsTrigger>
                      <TabsTrigger value="quality">Quality</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="processing" className="space-y-4">
                      <div>
                        <Label>Image Type</Label>
                        <Select value={processingOptions.type} onValueChange={(value: any) => 
                          setProcessingOptions(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto Detect</SelectItem>
                            <SelectItem value="person">Person</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="car">Vehicle</SelectItem>
                            <SelectItem value="animal">Animal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Output Size</Label>
                        <Select value={processingOptions.size} onValueChange={(value: any) => 
                          setProcessingOptions(prev => ({ ...prev, size: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="preview">Preview (0.25MP)</SelectItem>
                            <SelectItem value="regular">Regular (0.25MP)</SelectItem>
                            <SelectItem value="medium">Medium (1.5MP)</SelectItem>
                            <SelectItem value="hd">HD (4MP)</SelectItem>
                            <SelectItem value="4k">4K (up to 10MP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Output Format</Label>
                        <Select value={processingOptions.format} onValueChange={(value: any) => 
                          setProcessingOptions(prev => ({ ...prev, format: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="png">PNG (Transparent)</SelectItem>
                            <SelectItem value="jpg">JPG (White BG)</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="auto-crop"
                          checked={processingOptions.crop}
                          onCheckedChange={(checked) => 
                            setProcessingOptions(prev => ({ ...prev, crop: checked }))}
                        />
                        <Label htmlFor="auto-crop">Auto Crop</Label>
                      </div>
                    </TabsContent>

                    <TabsContent value="quality" className="space-y-4">
                      <div>
                        <Label>Edge Smoothing: {qualitySettings.edgeSmoothing}%</Label>
                        <Slider
                          value={[qualitySettings.edgeSmoothing]}
                          onValueChange={([value]) => 
                            setQualitySettings(prev => ({ ...prev, edgeSmoothing: value }))}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Feather Radius: {qualitySettings.featherRadius}px</Label>
                        <Slider
                          value={[qualitySettings.featherRadius]}
                          onValueChange={([value]) => 
                            setQualitySettings(prev => ({ ...prev, featherRadius: value }))}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Noise Reduction: {qualitySettings.noiseReduction}%</Label>
                        <Slider
                          value={[qualitySettings.noiseReduction]}
                          onValueChange={([value]) => 
                            setQualitySettings(prev => ({ ...prev, noiseReduction: value }))}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 border-t space-y-3">
                    <Button 
                      onClick={processAllImages}
                      disabled={isProcessing}
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Process All ({originalImages.length})
                    </Button>
                    
                    {processedImages.length > 0 && (
                      <Button 
                        onClick={downloadAll}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                    )}
                    
                    <Button 
                      onClick={resetAll}
                      variant="outline"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Main Processing Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Progress Bar */}
                {isProcessing && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-white animate-spin" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">Processing with AI...</p>
                          <Progress value={progress} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Image Grid */}
                <div className="grid gap-4">
                  {originalImages.map((image) => {
                    const processed = processedImages.find(p => p.id === image.id);
                    return (
                      <Card key={image.id} className={currentImageId === image.id ? 'ring-2 ring-purple-500' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{image.file.name}</CardTitle>
                            <div className="flex space-x-2">
                              {!processed && (
                                <Button 
                                  size="sm"
                                  onClick={() => processImage(image.id)}
                                  disabled={isProcessing}
                                  className="bg-purple-500 hover:bg-purple-600"
                                >
                                  <Wand2 className="h-4 w-4 mr-1" />
                                  Process
                                </Button>
                              )}
                              {processed && (
                                <Button 
                                  size="sm"
                                  onClick={() => downloadImage(image.id)}
                                  variant="outline"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              )}
                              <Button 
                                size="sm"
                                onClick={() => removeImage(image.id)}
                                variant="outline"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Original */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Original</Label>
                              <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                                <img
                                  src={image.url}
                                  alt="Original"
                                  className="w-full h-full object-contain cursor-pointer"
                                  onClick={() => setCurrentImageId(image.id)}
                                />
                              </div>
                            </div>

                            {/* Processed */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Background Removed</Label>
                              <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                                {processed ? (
                                  <img
                                    src={processed.url}
                                    alt="Background removed"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    {isProcessing && currentImageId === image.id ? (
                                      <div className="text-center">
                                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Processing...</p>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <Wand2 className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm">Click Process to remove background</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Add More Images */}
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Button 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-4"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Add More Images
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        or drag and drop more images here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Background Removal Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced AI technology with professional editing capabilities for perfect results every time
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Batch Processing</h3>
              <p className="text-muted-foreground">
                Process multiple images simultaneously with advanced queue management.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Precision</h3>
              <p className="text-muted-foreground">
                Advanced AI models detect different object types for optimal results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pro Controls</h3>
              <p className="text-muted-foreground">
                Fine-tune edge smoothing, noise reduction, and quality settings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">HD Output</h3>
              <p className="text-muted-foreground">
                Download in multiple formats and resolutions up to 4K quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .dark .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #2a2a2a 25%, transparent 25%), 
            linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #2a2a2a 75%), 
            linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
        }
      `}</style>
    </div>
  );
};

export default BackgroundRemover;
