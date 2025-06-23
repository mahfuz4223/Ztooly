
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Merge, Loader2, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { mergePDFs } from "@/utils/pdfUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePDFToolAnalytics } from '@/utils/analyticsHelper';
import { UsageStats } from '@/components/UsageStats';

const PDFMerge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [merged, setMerged] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Initialize analytics
  const analytics = usePDFToolAnalytics('pdf-merge', 'PDF Merge');
  const handleFileSelect = (selected: File[]) => {
    setFiles(selected);
    setMerged(null);
    if (selected.length > 0) {
      // Track file upload
      analytics.trackUpload();
      
      toast({ title: "Files ready", description: `${selected.length} files selected.` });
    }
  };
  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "Need at least two PDFs", variant: "destructive" });
      return;
    }
    
    // Track merge process
    analytics.trackProcess();
    
    setIsProcessing(true);
    setMerged(null);
    try {
      const blob = await mergePDFs(files);
      setMerged(blob);
      
      // Track successful generation
      analytics.trackGenerate();
      
      toast({ title: "Success", description: "PDFs merged!" });
    } catch (err) {
      toast({ title: "Error merging", description: String(err), variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!merged) return;
    
    // Track download action
    analytics.trackDownload();
    
    const url = URL.createObjectURL(merged);
    const link = document.createElement('a');
    link.href = url;
    link.download = `merged.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Download started", description: "Merged PDF saved." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 dark:from-neutral-900 dark:to-neutral-800">
      {/* No local nav/header. Global nav only. */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 flex flex-col items-center max-w-2xl">
        <Card className="w-full shadow-md rounded-xl border-0">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-400 rounded-xl shadow-md">
                <Merge className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Merge PDF Files</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Combine multiple PDFs into one document
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 px-2 sm:px-6 pb-6">
            {/* File Upload Section */}
            <div>
              <FileUpload 
                multiple={true}
                onFileSelect={handleFileSelect}
                maxSize={50}
                className="mb-1"
              />
            </div>
            {/* Preview + Info */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-1">Preview of first 2 files:</div>
                <div className="flex flex-col xs:flex-row gap-2">
                  {files.slice(0, 2).map((file, i) => (
                    <PDFPreview key={i} file={file} isProcessing={isProcessing} />
                  ))}
                </div>
                {files.length > 2 && (
                  <div className="text-xs italic text-muted-foreground mt-1">
                    +{files.length - 2} more file(s) selected...
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="w-full sm:w-auto flex-1 h-12 text-base"
              >
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Merge className="mr-2 h-5 w-5" />}
                Merge PDFs
              </Button>
              {merged && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full sm:w-auto flex-1 h-12 text-base border-2 border-green-200"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Add spacing for mobile */}
        <div className="h-5" />
        {/* Optional - link to PDF tools for easier navigation */}
        <Link to="/pdf-tools" className="mt-2 text-xs text-primary underline underline-offset-4 hover:no-underline">
          ← Back to PDF Tools        </Link>
        
        {/* Usage Statistics */}
        <UsageStats toolId="pdf-merge" />
      </div>
    </div>
  );
};

export default PDFMerge;
