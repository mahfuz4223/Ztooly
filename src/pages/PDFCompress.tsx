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
      toast({ title: "Success", description: "File compressed!" });
    } catch (err) {
      toast({ title: "Error compressing", description: String(err), variant: "destructive" });
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
      {/* No local nav/header. Global nav only. */}
      <div className="container mx-auto px-4 py-10 flex flex-col items-center max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Minimize className="h-7 w-7 text-green-500 mr-1" />
              <div>
                <CardTitle className="text-xl">Compress PDF</CardTitle>
                <CardDescription>Reduce PDF size, optimize for sharing.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload multiple={false} onFileSelect={handleFileSelect} maxSize={50} />
            {file && (
              <div>
                <PDFPreview file={file} isProcessing={isProcessing} />
                <div className="mt-4 flex gap-4">
                  {(['high', 'medium', 'low'] as const).map(l => (
                    <label key={l} className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border ${level === l ? "border-green-600 bg-green-100" : "border-gray-200"}`}>
                      <input type="radio" name="level" value={l} checked={level === l} onChange={() => setLevel(l)} className="accent-green-600" />
                      <span className="font-medium capitalize">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={handleCompress} disabled={!file || isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Minimize className="mr-2 h-4 w-4" />}
                Compress PDF
              </Button>
              {compressed && (
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

export default PDFCompress;
