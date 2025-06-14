
import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scissors, ArrowLeft, Download, Upload, Image as ImageIcon, RefreshCw, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const API_KEY = "4EsbZjKKCqTJLcYDwncFihre";

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 12 * 1024 * 1024) { // 12MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 12MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      processImage(file);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
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
      formData.append('image_file', file);
      formData.append('size', 'auto');

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
      setProcessedImage(processedUrl);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
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

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    link.click();
  };

  const resetImages = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProgress(0);
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
                Background Remover
              </span>
            </div>

            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Background Removal
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Remove Backgrounds
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Instantly & Perfectly
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional background removal in seconds. Perfect for products, portraits, and social media.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {!originalImage ? (
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
                    <h3 className="text-2xl font-semibold mb-2">Upload Your Image</h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop an image or click to browse. Max size: 12MB
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Image
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">JPG, PNG, WEBP</p>
                    </div>
                    <div className="text-center">
                      <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Lightning Fast</p>
                    </div>
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">AI Precision</p>
                    </div>
                    <div className="text-center">
                      <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">PNG Download</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Image Processing Area */
            <div className="space-y-8">
              {/* Progress Bar */}
              {isProcessing && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 text-white animate-spin" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">Removing background...</p>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Original
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Processed Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scissors className="h-5 w-5 mr-2" />
                      Background Removed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                      {processedImage ? (
                        <img
                          src={processedImage}
                          alt="Background removed"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          {isProcessing ? (
                            <div className="text-center">
                              <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
                              <p>Processing...</p>
                            </div>
                          ) : (
                            <p>Processed image will appear here</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {processedImage && (
                  <Button 
                    size="lg" 
                    onClick={downloadImage}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PNG
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={resetImages}
                  disabled={isProcessing}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Try Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Our Background Remover?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional results powered by advanced AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Remove backgrounds in seconds, not minutes. Our optimized AI delivers instant results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Precision</h3>
              <p className="text-muted-foreground">
                Advanced algorithms detect edges and preserve fine details like hair and fur.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">High Quality Output</h3>
              <p className="text-muted-foreground">
                Download your images in PNG format with transparent backgrounds, ready for any use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
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
