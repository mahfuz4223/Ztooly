
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFPreviewProps {
  file: File;
  previewUrl?: string;
  onDownload?: () => void;
  isProcessing?: boolean;
}

const PDFPreview = ({ file, previewUrl, onDownload, isProcessing }: PDFPreviewProps) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    } else {
      // Generate a simple preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 260;

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PDF', canvas.width / 2, 40);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.fillText(file.name.substring(0, 20), canvas.width / 2, canvas.height - 40);
        ctx.fillText(`${(file.size / 1024 / 1024).toFixed(1)} MB`, canvas.width / 2, canvas.height - 20);
        
        setPreview(canvas.toDataURL());
      }
    }
  }, [file, previewUrl]);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            {preview ? (
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
                <div className="text-white text-sm">Processing...</div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm truncate">{file.name}</h4>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              Preview
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
