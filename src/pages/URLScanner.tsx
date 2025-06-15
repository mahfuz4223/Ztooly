import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Clear previous result

    try {
      const response = await fetch(`/api/scan-url?url=${url}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to scan URL." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Removed header with back btn/local nav - use global nav only */}
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          🔎 URL Scanner
        </h1>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-green-100 items-center justify-center">
            <span role="img" aria-label="search" className="text-green-500 text-2xl">🌍</span>
          </span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Check URLs for safety, security, or status in seconds.
      </div>
      {/* Main content */}
      <div className="min-h-screen bg-background py-6">
        <div className="container max-w-2xl mx-auto space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Input
                  type="url"
                  placeholder="Enter URL to scan"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" isLoading={loading}>
                  Scan URL
                </Button>
              </form>

              {result && (
                <div className="space-y-2">
                  {result.error ? (
                    <div className="p-4 rounded-md bg-red-100 text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Error: {result.error}
                    </div>
                  ) : (
                    <>
                      {result.safe ? (
                        <div className="p-4 rounded-md bg-green-100 text-green-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          This URL appears to be safe.
                        </div>
                      ) : (
                        <div className="p-4 rounded-md bg-yellow-100 text-yellow-700 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          This URL may be potentially unsafe. Proceed with caution.
                        </div>
                      )}
                      {result.details && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold">Scan Details:</h3>
                          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
