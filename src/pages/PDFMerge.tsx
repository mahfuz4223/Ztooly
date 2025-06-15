
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Merge, Loader2, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { mergePDFs } from "@/utils/pdfUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PDFMerge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [merged, setMerged] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (selected: File[]) => {
    setFiles(selected);
    setMerged(null);
    if (selected.length > 0) {
      toast({ title: "Files ready", description: `${selected.length} files selected.` });
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "Need at least two PDFs", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setMerged(null);
    try {
      const blob = await mergePDFs(files);
      setMerged(blob);
      toast({ title: "Success", description: "PDFs merged!" });
    } catch (err) {
      toast({ title: "Error merging", description: String(err), variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!merged) return;
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
      <header className="border-b bg-background/70 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/pdf-tools" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            ← PDF Tools
          </Link>
          <Merge className="h-5 w-5 ml-1 text-purple-600" />
        </div>
      </header>
      <div className="container mx-auto px-4 py-10 flex flex-col items-center max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Merge className="h-7 w-7 text-purple-500 mr-1" />
              <div>
                <CardTitle className="text-xl">Merge PDF Files</CardTitle>
                <CardDescription>Combine multiple PDFs into one document</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload multiple={true} onFileSelect={handleFileSelect} maxSize={50} />
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Preview of first 2 files:</div>
                <div className="flex gap-3">
                  {files.slice(0, 2).map((file, i) => (
                    <PDFPreview key={i} file={file} isProcessing={isProcessing} />
                  ))}
                </div>
                {files.length > 2 && <div className="text-xs italic text-muted-foreground">{files.length - 2} more files...</div>}
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={handleMerge} disabled={files.length < 2 || isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Merge className="mr-2 h-4 w-4" />}
                Merge PDFs
              </Button>
              {merged && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PDFMerge;
