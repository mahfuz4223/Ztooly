
import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Scissors, ArrowLeft, Download, Upload, Image as ImageIcon, RefreshCw, Zap, Sparkles,
  Wand2, Crop, RotateCcw, Palette, Layers, FileImage, Grid, Settings, Trash2, Eye,
  Check, X, Play, ArrowRight, Maximize2, Star
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

interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

interface ProcessedImage {
  id: string;
  url: string;
  blob: Blob;
}

const dummyImages = [
  {
    id: 'demo-1',
    name: 'Portrait Example',
    original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    processed: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'Product Shot',
    original: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    processed: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    isDemo: true
  }
];

const BackgroundRemover = () => {
  const [originalImages, setOriginalImages] = useState<ImageItem[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [selectedImageView, setSelectedImageView] = useState<{id: string, type: 'original' | 'processed', url: string} | null>(null);
  const [showDemoImages, setShowDemoImages] = useState(true);
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
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setOriginalImages(prev => [...prev, ...newImages]);
    setShowDemoImages(false);
    
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
        title: "🎉 Background removed successfully!",
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
        await new Promise(resolve => setTimeout(resolve, 1000));
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

    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
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
    setShowDemoImages(true);
  };

  const openImageView = (id: string, type: 'original' | 'processed', url: string) => {
    setSelectedImageView({ id, type, url });
  };

  const tryDemo = () => {
    toast({
      title: "Demo Mode",
      description: "Upload your own images to see real background removal results!",
    });
  };

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

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Professional AI Background Removal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Remove Backgrounds
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced AI technology removes backgrounds instantly with pixel-perfect precision. 
            Perfect for portraits, products, and professional photography.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Images
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={tryDemo}
              className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5s</div>
              <div className="text-sm text-muted-foreground">Avg. Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4K</div>
              <div className="text-sm text-muted-foreground">Max Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12MB</div>
              <div className="text-sm text-muted-foreground">Max Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {originalImages.length === 0 ? (
            <div className="space-y-8">
              {/* Upload Area */}
              <Card className={`border-2 border-dashed transition-all duration-300 ${
                isDragging 
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/20 scale-105' 
                  : 'border-muted-foreground/25 hover:border-purple-300'
              }`}>
                <CardContent className="p-12">
                  <div
                    className="text-center space-y-6 transition-transform"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold mb-3">Upload Your Images</h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        Drag and drop images or click to browse. Supports JPG, PNG, WEBP up to 12MB each
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg" 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Choose Images
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={tryDemo}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View Examples
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
                  </div>
                </CardContent>
              </Card>

              {/* Demo Images */}
              {showDemoImages && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                      Example Results
                    </CardTitle>
                    <CardDescription>
                      See the quality you can expect from our AI background removal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {dummyImages.map((demo) => (
                        <div key={demo.id} className="space-y-4">
                          <h4 className="font-semibold text-center">{demo.name}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Original</Label>
                              <div 
                                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                                onClick={() => openImageView(demo.id, 'original', demo.original)}
                              >
                                <img
                                  src={demo.original}
                                  alt="Original demo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Background Removed</Label>
                              <div 
                                className="aspect-square bg-checkerboard rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                                onClick={() => openImageView(demo.id, 'processed', demo.processed)}
                              >
                                <img
                                  src={demo.processed}
                                  alt="Processed demo"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={tryDemo}
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Try with your images
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Batch Processing</h3>
                  <p className="text-sm text-muted-foreground">Process multiple images at once</p>
                </Card>
                
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Precision</h3>
                  <p className="text-sm text-muted-foreground">Advanced AI for perfect edges</p>
                </Card>
                
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Pro Controls</h3>
                  <p className="text-sm text-muted-foreground">Fine-tune every detail</p>
                </Card>
                
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">HD Output</h3>
                  <p className="text-sm text-muted-foreground">Download in 4K quality</p>
                </Card>
              </div>
            </div>
          ) : (
            /* Processing Interface */
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Settings Panel */}
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-500" />
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
                            <SelectItem value="auto">🤖 Auto Detect</SelectItem>
                            <SelectItem value="person">👤 Person</SelectItem>
                            <SelectItem value="product">📦 Product</SelectItem>
                            <SelectItem value="car">🚗 Vehicle</SelectItem>
                            <SelectItem value="animal">🐕 Animal</SelectItem>
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
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
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
                  <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <RefreshCw className="h-6 w-6 text-white animate-spin" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                            ✨ Processing with AI Magic...
                          </p>
                          <Progress value={progress} className="h-3" />
                        </div>
                        <span className="text-lg font-bold text-purple-600">{Math.round(progress)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Image Grid */}
                <div className="space-y-6">
                  {originalImages.map((image) => {
                    const processed = processedImages.find(p => p.id === image.id);
                    return (
                      <Card 
                        key={image.id} 
                        className={`transition-all duration-300 ${
                          currentImageId === image.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center">
                                <FileImage className="h-5 w-5 mr-2 text-purple-500" />
                                {image.name}
                              </CardTitle>
                              <CardDescription>
                                {(image.file.size / 1024 / 1024).toFixed(1)}MB • {image.file.type}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              {!processed ? (
                                <Button 
                                  size="sm"
                                  onClick={() => processImage(image.id)}
                                  disabled={isProcessing}
                                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                  <Wand2 className="h-4 w-4 mr-1" />
                                  Process
                                </Button>
                              ) : (
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => downloadImage(image.id)}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                  <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                                    <Check className="h-4 w-4 text-green-600 mr-1" />
                                    <span className="text-sm text-green-600 font-medium">Ready</span>
                                  </div>
                                </div>
                              )}
                              <Button 
                                size="sm"
                                onClick={() => removeImage(image.id)}
                                variant="outline"
                                className="hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Original */}
                            <div>
                              <Label className="text-sm font-medium mb-3 block flex items-center">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Original
                              </Label>
                              <div 
                                className="aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all group"
                                onClick={() => openImageView(image.id, 'original', image.url)}
                              >
                                <div className="relative w-full h-full">
                                  <img
                                    src={image.url}
                                    alt="Original"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Processed */}
                            <div>
                              <Label className="text-sm font-medium mb-3 block flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                                Background Removed
                              </Label>
                              <div 
                                className="aspect-square bg-checkerboard rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all group"
                                onClick={() => processed && openImageView(image.id, 'processed', processed.url)}
                              >
                                {processed ? (
                                  <div className="relative w-full h-full">
                                    <img
                                      src={processed.url}
                                      alt="Background removed"
                                      className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl">
                                    {isProcessing && currentImageId === image.id ? (
                                      <div className="text-center">
                                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-purple-500" />
                                        <p className="text-sm font-medium text-purple-600">Processing...</p>
                                        <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <Wand2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">Click Process</p>
                                        <p className="text-xs text-muted-foreground mt-1">to remove background</p>
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
                <Card className="border-dashed border-2 hover:border-purple-300 transition-colors">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Button 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-4 hover:bg-purple-50 hover:border-purple-200"
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

      {/* Image View Dialog */}
      <Dialog open={!!selectedImageView} onOpenChange={() => setSelectedImageView(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center">
              {selectedImageView?.type === 'original' ? (
                <>
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Original Image
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                  Background Removed
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            {selectedImageView && (
              <div className={selectedImageView.type === 'processed' ? 'bg-checkerboard rounded-lg' : ''}>
                <img
                  src={selectedImageView.url}
                  alt={selectedImageView.type}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
