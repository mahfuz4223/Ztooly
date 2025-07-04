import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { pdfToWord } from "@/utils/pdfUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { UsageStats } from "@/components/UsageStats";

const PDFToWord = () => {
  const { trackAction } = useAnalytics({
    toolId: "pdf-to-word",
    toolName: "PDF to Word Converter"
  });

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const { toast } = useToast();
  const handleFileSelect = (files: File[]) => {
    setFile(files[0] ?? null);
    setResult(null);
    if (files.length > 0) {
      // Track file upload
      trackAction('upload');
      toast({ title: "File ready", description: files[0].name });
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast({ title: "No PDF selected", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setResult(null);    try {
      const blob = await pdfToWord(file);
      setResult(blob);
      // Track successful conversion
      trackAction('process');
      toast({ title: "Success", description: "Converted to Word!" });
    } catch (err) {
      toast({ title: "Error converting", description: String(err), variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const link = document.createElement('a');
    link.href = url;
    link.download = "converted.docx";
    link.click();
    URL.revokeObjectURL(url);
    
    // Track download action
    trackAction('download');
    toast({ title: "Download started", description: "Word file saved." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-200 dark:from-neutral-900 dark:to-neutral-800">
      {/* No local nav/header. Global nav only. */}
      <div className="container mx-auto px-4 py-10 flex flex-col items-center max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7 text-orange-500 mr-1" />
              <div>
                <CardTitle className="text-xl">PDF to Word</CardTitle>
                <CardDescription>Convert PDF to editable DOCX</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload multiple={false} onFileSelect={handleFileSelect} maxSize={50} />
            {file && <PDFPreview file={file} isProcessing={isProcessing} />}
            <div className="flex gap-4">
              <Button onClick={handleConvert} disabled={!file || isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                Convert
              </Button>
              {result && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>        </Card>
        
        {/* Usage Statistics */}
        <UsageStats toolId="pdf-to-word" />
      </div>
    </div>
  );
};

export default PDFToWord;
