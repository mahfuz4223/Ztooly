import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image as ImageIcon, Loader2, Copy, AlertCircle, Info, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { modelManager } from '@/utils/modelManager';
import { useModelPreloader } from '@/hooks/useModelPreloader';

const AIImageCaptionGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const { isPreloading, isPreloaded, preloadError } = useModelPreloader();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB.');
      return;
    }

    setError('');
    setSelectedImage(file);
    setCaption('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateCaption = async () => {
    if (!selectedImage || !imagePreview) return;

    setIsGenerating(true);
    setError('');

    try {
      const generatedCaption = await modelManager.generateCaption(imagePreview);
      
      if (generatedCaption) {
        setCaption(generatedCaption);
        
        toast({
          title: "Caption Generated!",
          description: "Your image caption has been created using AI.",
        });
      } else {
        throw new Error('No caption generated');
      }
    } catch (err) {
      console.error('Caption generation error:', err);
      setError('Failed to generate caption. Please try again or check your internet connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      toast({
        title: "Copied!",
        description: "Caption copied to clipboard.",
      });
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setImagePreview('');
    setCaption('');
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Image Caption Generator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image and let AI generate descriptive captions using optimized models
        </p>
      </div>

      {/* Model Status Alert */}
      <Alert className={`mb-6 ${isPreloaded ? 'border-green-200 bg-green-50' : isPreloading ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}`}>
        {isPreloaded ? (
          <Zap className="h-4 w-4 text-green-600" />
        ) : (
          <Info className="h-4 w-4 text-blue-600" />
        )}
        <AlertDescription className={isPreloaded ? 'text-green-800' : 'text-blue-800'}>
          {isPreloaded ? (
            <><strong>Ready!</strong> AI model is loaded and ready for fast caption generation.</>
          ) : isPreloading ? (
            <><strong>Loading...</strong> AI model is being prepared for faster performance.</>
          ) : preloadError ? (
            <><strong>Error:</strong> {preloadError}</>
          ) : (
            <><strong>Optimized AI:</strong> This tool uses a cached AI model for faster performance.</>
          )}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Select an image file to generate a caption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="image-upload"
              />
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {imagePreview && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={generateCaption}
                    disabled={isGenerating || (!isPreloaded && !preloadError)}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        {isPreloaded && <Zap className="h-4 w-4 mr-2" />}
                        Generate Caption
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
                {isGenerating && loadingMessage && (
                  <div className="text-sm text-muted-foreground text-center">
                    {loadingMessage}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Generated Caption
            </CardTitle>
            <CardDescription>
              AI-generated description with optimized performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {caption ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{caption}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Caption
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Upload an image and click "Generate Caption" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Performance Features</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fast Loading</h3>
            <p className="text-sm text-muted-foreground">
              Model preloads for instant generation
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Select and upload your image file
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Loader2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Analyze</h3>
            <p className="text-sm text-muted-foreground">
              Optimized AI analyzes quickly
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Copy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Generate</h3>
            <p className="text-sm text-muted-foreground">
              Get captions in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageCaptionGenerator;
