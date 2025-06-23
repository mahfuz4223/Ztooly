import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import PDFPreview from "@/components/PDFPreview";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { UsageStats } from "@/components/UsageStats";

const PDFPassword = () => {
  const { trackAction } = useAnalytics({
    toolId: "pdf-password",
    toolName: "PDF Password Protection"
  });

  // Placeholder—actual PDF password protection not implemented.
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0] ?? null);
    if (files.length > 0) {
      // Track file upload
      trackAction('upload');
    }
  };

  const handleProtect = () => {
    if (!file || !password) {
      toast({ title: "Provide PDF and password", variant: "destructive" });
      return;
    }
    setIsProcessing(true);    setTimeout(() => {
      setIsProcessing(false);
      // Track process attempt (even if it's a placeholder)
      trackAction('process');
      toast({ title: "Feature coming soon!", description: "PDF protection will be available in a future update." });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-200 dark:from-neutral-900 dark:to-neutral-800">
      {/* No local nav/header. Global nav only. */}
      <div className="container mx-auto px-4 py-10 flex flex-col items-center max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <KeyRound className="h-7 w-7 text-pink-500 mr-1" />
              <div>
                <CardTitle className="text-xl">Add Password to PDF</CardTitle>
                <CardDescription>Protect your PDF with a password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FileUpload multiple={false} onFileSelect={handleFileSelect} maxSize={50} />
            {file && <PDFPreview file={file} isProcessing={isProcessing} />}
            <div className="mt-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter password"
                disabled={isProcessing}
              />
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleProtect} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <KeyRound className="mr-2 h-4 w-4" />}
                {isProcessing ? "Processing..." : "Protect PDF"}
              </Button>
              <Button variant="outline" disabled>
                Coming soon
              </Button>            </div>
          </CardContent>
        </Card>
        
        {/* Usage Statistics */}
        <UsageStats toolId="pdf-password" />
      </div>
    </div>
  );
};

export default PDFPassword;
