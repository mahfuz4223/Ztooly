
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Minimize, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { compressPDF } from "@/utils/pdfUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PDFCompress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] ?? null);
    setCompressed(null);
    if (files.length > 0) {
      toast({ title: "File ready", description: files[0].name });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({ title: "No PDF selected", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setCompressed(null);
    try {
      const result = await compressPDF(file, level);
      setCompressed(result);

      // Show new file size for info
      toast({ 
        title: "Success",
        description: `File compressed! Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`,
      });
    } catch (err) {
      toast({ 
        title: "Error compressing",
        description: String(err),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressed) return;
    const url = URL.createObjectURL(compressed);
    const link = document.createElement('a');
    link.href = url;
    link.download = "compressed.pdf";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Download started", description: "Compressed PDF saved." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-10 flex flex-col items-center max-w-lg sm:max-w-2xl">
        {/* Responsive Card */}
        <Card className="w-full rounded-lg shadow-lg p-0">
          <CardHeader className="pb-2 flex flex-col space-y-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Minimize className="h-7 w-7 text-green-500 mr-1" />
              <div>
                <CardTitle className="text-lg sm:text-xl">Compress PDF</CardTitle>
                <CardDescription className="text-xs sm:text-base">
                  Reduce file size &amp; optimize for sharing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-6 px-2 sm:px-6 pb-5">
            {/* File Upload */}
            <FileUpload
              multiple={false}
              onFileSelect={handleFileSelect}
              maxSize={50}
              className="mb-1"
            />

            {/* PDF Preview */}
            {file && (
              <div>
                <PDFPreview file={file} isProcessing={isProcessing} />
                {/* Compression Level Radio */}
                <div className="mt-3 flex flex-col xs:flex-row gap-2 xs:gap-4">
                  {(['high', 'medium', 'low'] as const).map(l => (
                    <label
                      key={l}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded cursor-pointer border transition
                        ${level === l
                          ? "border-green-600 bg-green-100 text-green-700"
                          : "border-gray-200 bg-white/80 dark:bg-muted text-gray-700"}
                      `}
                    >
                      <input
                        type="radio"
                        name="level"
                        value={l}
                        checked={level === l}
                        onChange={() => setLevel(l)}
                        className="accent-green-600"
                      />
                      <span className="font-medium capitalize">{l} {l === "low" && "(smallest file)"}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Status Box: file info / error / download */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button
                onClick={handleCompress}
                disabled={!file || isProcessing}
                className="w-full sm:w-auto flex-1 h-12 text-base"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  <Minimize className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? "Compressing..." : "Compress PDF"}
              </Button>
              {compressed && (
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
            {compressed && (
              <div className="text-green-700 text-xs pt-1">
                Compressed file size: {(compressed.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </CardContent>
        </Card>
        {/* Spacing for mobile footer nav if needed */}
        <div className="h-4" />
        {/* Back to PDF tools navigation */}
        <Link to="/pdf-tools" className="mt-3 text-xs text-primary underline underline-offset-4 hover:no-underline">
          ← Back to PDF Tools
        </Link>
      </div>
    </div>
  );
};

export default PDFCompress;
