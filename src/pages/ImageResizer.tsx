import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageIcon, 
  Upload, 
  Download, 
  Smartphone, 
  Monitor, 
  Tablet,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  X,
  RotateCcw,
  Crop,
  Settings,
  Zap,
  ArrowLeft,
  Eye,
  FileImage,
  Maximize2,
  Info,
  Trash2,
  DownloadCloud,
  Clock,
  CheckCircle,
  AlertCircle,
  Images,
  Plus,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

interface ImageFile extends File {
  id: string;
  preview: string;
  originalDimensions?: { width: number; height: number };
  status: 'pending' | 'processing' | 'completed' | 'error';
  processedUrl?: string;
  processedSize?: number;
  processedDimensions?: { width: number; height: number };
  compressionRatio?: number;
}

interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

const ImageResizer = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [customHeight, setCustomHeight] = useState<number>(600);
  const [quality, setQuality] = useState<number[]>([90]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<string>('original');
  const [batchMode, setBatchMode] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presets = [
    { id: 'instagram-square', name: 'Instagram Square', width: 1080, height: 1080, icon: Instagram, category: 'Social' },
    { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, icon: Instagram, category: 'Social' },
    { id: 'facebook-cover', name: 'Facebook Cover', width: 1200, height: 630, icon: Facebook, category: 'Social' },
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: Youtube, category: 'Social' },
    { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, icon: Linkedin, category: 'Social' },
    { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, icon: X, category: 'Social' },
    { id: 'mobile', name: 'Mobile Screen', width: 375, height: 667, icon: Smartphone, category: 'Device' },
    { id: 'tablet', name: 'Tablet Screen', width: 768, height: 1024, icon: Tablet, category: 'Device' },
    { id: 'desktop', name: 'Desktop HD', width: 1920, height: 1080, icon: Monitor, category: 'Device' },
    { id: 'desktop-4k', name: 'Desktop 4K', width: 3840, height: 2160, icon: Monitor, category: 'Device' },
  ];

  const demoImages = [
    { name: 'Mountain Landscape', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800', size: '2.1 MB', dimensions: '1200×800' },
    { name: 'City Skyline', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800', size: '1.8 MB', dimensions: '1200×800' },
    { name: 'Portrait Photo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200', size: '1.5 MB', dimensions: '800×1200' },
    { name: 'Nature Close-up', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800', size: '2.3 MB', dimensions: '1200×800' },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 50MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const newImageFiles: ImageFile[] = validFiles.map(file => {
      const imageFile = Object.assign(file, {
        id: generateId(),
        preview: URL.createObjectURL(file),
        status: 'pending' as const
      });

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageFiles(prev => prev.map(f => 
          f.id === imageFile.id 
            ? { ...f, originalDimensions: { width: img.width, height: img.height } }
            : f
        ));
      };
      img.src = imageFile.preview;

      return imageFile;
    });

    setImageFiles(prev => [...prev, ...newImageFiles]);
    
    if (newImageFiles.length > 1) {
      setBatchMode(true);
    }

    toast({
      title: "Images added",
      description: `Added ${newImageFiles.length} image(s) for processing`,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setCustomWidth(value);
      if (maintainAspectRatio && imageFiles.length === 1 && imageFiles[0].originalDimensions) {
        const aspectRatio = imageFiles[0].originalDimensions.width / imageFiles[0].originalDimensions.height;
        setCustomHeight(Math.round(value / aspectRatio));
      }
    } else {
      setCustomHeight(value);
      if (maintainAspectRatio && imageFiles.length === 1 && imageFiles[0].originalDimensions) {
        const aspectRatio = imageFiles[0].originalDimensions.width / imageFiles[0].originalDimensions.height;
        setCustomWidth(Math.round(value * aspectRatio));
      }
    }
    setSelectedPreset('');
  };

  const resizeImage = async (imageFile: ImageFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = customWidth;
        canvas.height = customHeight;
        
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, customWidth, customHeight);
          
          const format = outputFormat === 'original' ? imageFile.type : `image/${outputFormat}`;
          const qualityValue = quality[0] / 100;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const processedUrl = URL.createObjectURL(blob);
              const compressionRatio = ((imageFile.size - blob.size) / imageFile.size) * 100;
              
              setImageFiles(prev => prev.map(f => 
                f.id === imageFile.id 
                  ? { 
                      ...f, 
                      status: 'completed',
                      processedUrl,
                      processedSize: blob.size,
                      processedDimensions: { width: customWidth, height: customHeight },
                      compressionRatio
                    }
                  : f
              ));
              resolve();
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, format, qualityValue);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageFile.preview;
    });
  };

  const processImages = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const pendingImages = imageFiles.filter(img => img.status === 'pending');
    
    for (let i = 0; i < pendingImages.length; i++) {
      const imageFile = pendingImages[i];
      
      try {
        setImageFiles(prev => prev.map(f => 
          f.id === imageFile.id ? { ...f, status: 'processing' } : f
        ));
        
        await resizeImage(imageFile);
        
        setProcessingProgress(((i + 1) / pendingImages.length) * 100);
      } catch (error) {
        console.error('Error processing image:', error);
        setImageFiles(prev => prev.map(f => 
          f.id === imageFile.id ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setIsProcessing(false);
    
    const completedCount = imageFiles.filter(img => img.status === 'completed').length;
    toast({
      title: "Processing complete!",
      description: `Successfully processed ${completedCount} image(s)`,
    });
  };

  const downloadImage = (imageFile: ImageFile) => {
    if (!imageFile.processedUrl) return;
    
    const link = document.createElement('a');
    link.href = imageFile.processedUrl;
    const format = outputFormat === 'original' ? imageFile.type.split('/')[1] : outputFormat;
    link.download = `resized-${imageFile.name.split('.')[0]}-${customWidth}x${customHeight}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    const completedImages = imageFiles.filter(img => img.status === 'completed' && img.processedUrl);
    completedImages.forEach(img => downloadImage(img));
    
    toast({
      title: "Download started",
      description: `Downloading ${completedImages.length} processed images`,
    });
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const updated = prev.filter(img => img.id !== id);
      if (updated.length <= 1) {
        setBatchMode(false);
      }
      return updated;
    });
  };

  const reset = () => {
    imageFiles.forEach(img => {
      URL.revokeObjectURL(img.preview);
      if (img.processedUrl) {
        URL.revokeObjectURL(img.processedUrl);
      }
    });
    setImageFiles([]);
    setBatchMode(false);
    setSelectedPreset('');
    setCustomWidth(800);
    setCustomHeight(600);
    setProcessingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: ImageFile['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const groupedPresets = presets.reduce((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, typeof presets>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SiteNav />
      <div className="container mx-auto px-4 py-8">
        {imageFiles.length === 0 ? (
          <div className="max-w-5xl mx-auto">
            {/* Upload Section */}
            <Card className="mb-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upload Your Images
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Drag multiple images or click to browse. Supports batch processing for efficiency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold mb-3">Drop your images here</p>
                      <p className="text-slate-600 mb-4">or click to browse files • Supports JPG, PNG, GIF, WebP</p>
                      <p className="text-sm text-slate-500">Multiple files supported for batch processing</p>
                    </div>
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Images
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Demo Images */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Eye className="h-6 w-6 text-blue-600" />
                  Try with Demo Images
                </CardTitle>
                <CardDescription className="text-lg">
                  Click on any demo image to see the resizer in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {demoImages.map((demo, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white"
                      onClick={async () => {
                        try {
                          const response = await fetch(demo.url);
                          const blob = await response.blob();
                          const file = new File([blob], `demo-${index + 1}.jpg`, { type: 'image/jpeg' });
                          handleFiles([file]);
                        } catch (error) {
                          toast({
                            title: "Error loading demo image",
                            description: "Please try uploading your own image instead.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={demo.url}
                          alt={demo.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Plus className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-slate-900 mb-1">{demo.name}</p>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>{demo.dimensions}</span>
                          <span>{demo.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Column - Controls */}
              <div className="lg:col-span-1 space-y-6">
                {/* Batch Mode Toggle */}
                {imageFiles.length > 1 && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Layers className="h-5 w-5 text-blue-600" />
                        Batch Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="batch-mode"
                          checked={batchMode}
                          onCheckedChange={setBatchMode}
                        />
                        <Label htmlFor="batch-mode" className="text-sm">
                          Process all images with same settings
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Presets */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Quick Presets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(groupedPresets).map(([category, presets]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-slate-600 mb-2">{category}</h4>
                        <div className="grid gap-2">
                          {presets.map((preset) => {
                            const Icon = preset.icon;
                            return (
                              <Button
                                key={preset.id}
                                variant={selectedPreset === preset.id ? "default" : "outline"}
                                className="justify-start h-auto p-3 text-left"
                                onClick={() => handlePresetSelect(preset)}
                              >
                                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-medium truncate">{preset.name}</div>
                                  <div className="text-xs text-slate-500">{preset.width} × {preset.height}</div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Custom Dimensions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crop className="h-5 w-5 text-blue-600" />
                      Custom Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                      <Label htmlFor="aspect-ratio" className="text-sm">Lock aspect ratio</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="width" className="text-sm font-medium">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                          min="1"
                          max="10000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-sm font-medium">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                          min="1"
                          max="10000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Quality & Format
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Quality: {quality[0]}%</Label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="format" className="text-sm font-medium">Output Format</Label>
                      <select
                        id="format"
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="original">Same as original</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Process Button */}
                <div className="space-y-3">
                  <Button
                    onClick={processImages}
                    disabled={isProcessing || imageFiles.length === 0}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processing... {Math.round(processingProgress)}%
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-5 w-5 mr-2" />
                        Process {batchMode ? 'All ' : ''}{imageFiles.length} Image{imageFiles.length > 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                  
                  {imageFiles.filter(img => img.status === 'completed').length > 0 && (
                    <Button
                      onClick={downloadAll}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <DownloadCloud className="h-5 w-5 mr-2" />
                      Download All ({imageFiles.filter(img => img.status === 'completed').length})
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column - Image Management */}
              <div className="lg:col-span-3 space-y-6">
                {/* Image Queue */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Images className="h-5 w-5 text-blue-600" />
                        Image Queue ({imageFiles.length})
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add More
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {imageFiles.map((imageFile) => (
                        <div key={imageFile.id} className="border border-slate-200 rounded-lg p-4 bg-white/50">
                          <div className="flex items-start gap-4">
                            {/* Thumbnail */}
                            <div className="relative">
                              <img
                                src={imageFile.preview}
                                alt={imageFile.name}
                                className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                              />
                              <div className="absolute -top-2 -right-2">
                                {getStatusIcon(imageFile.status)}
                              </div>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-slate-900 truncate">{imageFile.name}</h4>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {formatFileSize(imageFile.size)}
                                    {imageFile.originalDimensions && (
                                      <> • {imageFile.originalDimensions.width} × {imageFile.originalDimensions.height}</>
                                    )}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => removeImage(imageFile.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Progress/Results */}
                              {imageFile.status === 'completed' && imageFile.processedDimensions && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="bg-green-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-green-700 font-medium">New Size</div>
                                    <div className="text-sm font-semibold text-green-800">
                                      {imageFile.processedDimensions.width} × {imageFile.processedDimensions.height}
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-blue-700 font-medium">File Size</div>
                                    <div className="text-sm font-semibold text-blue-800">
                                      {imageFile.processedSize ? formatFileSize(imageFile.processedSize) : 'N/A'}
                                    </div>
                                  </div>
                                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-purple-700 font-medium">Compression</div>
                                    <div className="text-sm font-semibold text-purple-800">
                                      {imageFile.compressionRatio?.toFixed(1)}%
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <Button
                                      onClick={() => downloadImage(imageFile)}
                                      size="sm"
                                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {imageFile.status === 'processing' && (
                                <div className="mt-3">
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${processingProgress}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1">Processing...</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add more files area */}
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mt-4 cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">Add more images to batch</p>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResizer;
