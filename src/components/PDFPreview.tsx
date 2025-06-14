
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePDFPreview } from '@/utils/pdfUtils';

interface PDFPreviewProps {
  file: File;
  previewUrl?: string;
  onDownload?: () => void;
  isProcessing?: boolean;
}

const PDFPreview = ({ file, previewUrl, onDownload, isProcessing }: PDFPreviewProps) => {
  const [preview, setPreview] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      if (previewUrl) {
        setPreview(previewUrl);
      } else {
        setIsLoadingPreview(true);
        try {
          const generatedPreview = await generatePDFPreview(file);
          setPreview(generatedPreview);
        } catch (error) {
          console.error('Failed to generate preview:', error);
        } finally {
          setIsLoadingPreview(false);
        }
      }
    };

    loadPreview();
  }, [file, previewUrl]);

  const handlePreview = () => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            {isLoadingPreview ? (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              </div>
            ) : preview ? (
              <img 
                src={preview} 
                alt="PDF Preview" 
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-sm font-medium">Processing...</div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {onDownload && (
              <Button 
                onClick={onDownload} 
                size="sm" 
                className="flex-1"
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFPreview;
