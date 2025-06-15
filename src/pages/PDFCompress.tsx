
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Minimize, Loader2, Download, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { compressPDF } from "@/utils/pdfUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const compressionLabels = {
  high: "Best quality (least compression)",
  medium: "Balanced",
  low: "Smallest file (most compression)"
};

const PDFCompress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const { toast } = useToast();
  const [originalSize, setOriginalSize] = useState<number>(0);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] ?? null);
    setCompressed(null);
    setOriginalSize(files[0] ? files[0].size : 0);
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

  // File size formatting helper
  const formatSize = (bytes: number) =>
    bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-1 sm:px-3 py-3 sm:py-6 flex flex-col items-center max-w-full sm:max-w-2xl">
        <Card className="w-full rounded-lg shadow-xl p-0">
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
          <CardContent className="space-y-3 sm:space-y-5 px-1 sm:px-5 pb-3">
            {/* File Upload */}
            <FileUpload
              multiple={false}
              onFileSelect={handleFileSelect}
              maxSize={50}
              className="mb-1"
            />
            
            {/* PDF Preview or No File */}
            {file ? (
              <div>
                <PDFPreview file={file} isProcessing={isProcessing} />
                {/* Compression Level */}
                <div className="mt-3 flex flex-col xs:flex-row gap-2 xs:gap-4">
                  {(['low', 'medium', 'high'] as const).map(l => (
                    <label
                      key={l}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded cursor-pointer border text-xs sm:text-sm transition
                        ${level === l
                          ? "border-green-600 bg-green-100 text-green-700 font-semibold"
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
                      <span>
                        {compressionLabels[l]} 
                        {l === "low" && <span className="ml-1 text-[10px] text-green-600 font-bold">(strongest compression)</span>}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground bg-white/60 dark:bg-neutral-900 py-1 px-2 rounded">
                  <Info className="w-4 h-4 text-green-500" />
                  Compression is lossless for text and PDF structure, but may not shrink scanned/image-heavy PDFs. "Low" uses the strongest settings but may not always drastically reduce size due to PDF content.
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground text-xs sm:text-sm bg-white/40 rounded">
                Upload a PDF file to start.
              </div>
            )}

            {/* Status Box & Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mt-4">
              <Button
                onClick={handleCompress}
                disabled={!file || isProcessing}
                className="w-full sm:w-auto flex-1 h-10 sm:h-12 text-sm sm:text-base"
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
                  className="w-full sm:w-auto flex-1 h-10 sm:h-12 text-sm sm:text-base border-2 border-green-200"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              )}
            </div>
            {/* Size Info Summary */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 text-xs pt-2">
              {file && (
                <>
                  <div>
                    <span className="font-semibold">Original:</span> {formatSize(originalSize)}
                  </div>
                  <span className="hidden xs:inline text-muted-foreground px-2">→</span>
                  {compressed && (
                    <div>
                      <span className="font-semibold text-green-700">Compressed:</span>{" "}
                      {formatSize(compressed.size)}
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        ({originalSize > 0
                          ? ((compressed.size / originalSize) < 1
                              ? `-${((1 - compressed.size / originalSize) * 100).toFixed(1)}%`
                              : "+0%"
                            )
                          : "n/a"})
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Mobile spacing */}
        <div className="h-4" />
        <Link to="/pdf-tools" className="mt-3 text-xs text-primary underline underline-offset-4 hover:no-underline">
          ← Back to PDF Tools
        </Link>
      </div>
    </div>
  );
};

export default PDFCompress;
