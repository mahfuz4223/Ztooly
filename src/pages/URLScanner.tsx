
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper to extract all anchor links from raw HTML
function extractLinksFromHtml(html: string, base: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links = Array.from(doc.querySelectorAll("a"))
    .map(a => {
      let href = a.getAttribute("href") || "";
      // Make relative URLs absolute
      try {
        href = new URL(href, base).href;
      } catch {}
      return {
        href,
        text: a.textContent?.trim() || href,
      };
    })
    .filter(l => l.href.startsWith("http"));
  return links;
}

const URLScanner: React.FC = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [links, setLinks] = useState<{ href: string; text: string }[]>([]);
  const [usedProxy, setUsedProxy] = useState(false);
  const navigate = useNavigate();

  // Try fetch, with fallback to CORS proxy
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("scanning");
    setError("");
    setLinks([]);
    setUsedProxy(false);
    // Basic format enforcement
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;

    // Helper to actually fetch (with/without proxy)
    const fetchHtml = async (useProxy = false): Promise<{ html: string; asProxy: boolean }> => {
      let finalUrl = useProxy ?
        `https://corsproxy.io/?${encodeURIComponent(target)}` :
        target;
      // Always let fetch throw so we can handle fallback/error
      const res = await fetch(finalUrl, {
        mode: useProxy ? "cors" : "cors",
        headers: useProxy
          ? { "x-cors-headers": "1" } // Some proxies require but not all
          : undefined,
      });
      if (!res.ok) throw new Error(`HTTP error (${res.status})`);
      const html = await res.text();
      return { html, asProxy: useProxy };
    };

    // First try direct, then fallback
    try {
      let result;
      try {
        result = await fetchHtml(false);
      } catch (err) {
        // If this fails, try proxy
        result = await fetchHtml(true);
        setUsedProxy(true);
      }
      const found = extractLinksFromHtml(result.html, target);
      setLinks(found);
      setStatus("done");
    } catch (err: any) {
      setError("Could not fetch or parse this URL. This may be due to extra anti-bot/CORS protection, too many redirects, or the site blocking scanning altogether.");
      setStatus("error");
      setUsedProxy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-2xl mx-auto px-4 py-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => navigate("/")}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          URL Scanner <span className="text-primary">(Link Checker)</span>
        </h1>
      </header>
      <main className="max-w-xl mx-auto w-full px-4">
        <Card>
          <CardContent>
            <form onSubmit={handleScan} className="flex flex-col gap-4 py-6">
              <label className="font-medium text-muted-foreground">
                Enter website URL to scan for links:
              </label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                  className="flex-1"
                  required
                  pattern="^https?://.+"
                  autoFocus
                />
                <Button type="submit" disabled={status === "scanning"}>
                  {status === "scanning" ? "Scanning..." : "Scan"}
                </Button>
              </div>
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
            </form>
            {status === "done" && (
              <div className="py-2">
                <div className="flex items-center mb-2 gap-2">
                  <h2 className="font-semibold">Links found: {links.length}</h2>
                  {usedProxy && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 border border-yellow-300 font-medium" title="A CORS proxy was used to fetch the site, as direct scan was blocked by CORS.">
                      Fetched via proxy
                    </span>
                  )}
                </div>
                <div className="rounded border bg-muted divide-y max-h-80 overflow-auto">
                  {links.length === 0 && (
                    <div className="text-muted-foreground p-3 text-center">
                      No links were found on this page.
                    </div>
                  )}
                  {links.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm hover:bg-accent transition truncate"
                      title={link.href}
                    >
                      {link.text.length > 40 ? link.text.slice(0,40) + "…" : link.text}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="text-xs text-muted-foreground text-center mt-6">
          Note: Most sites can be scanned.<br />
          <span>
            If your site still can't be scanned, it likely blocks all bots and proxies (anti-bot/CORS).<br />
            For more stability, host your own proxy or use our <a href="https://docs.lovable.dev/integrations/supabase/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Supabase backend integration</a>.
          </span>
        </div>
      </main>
    </div>
  );
};

export default URLScanner;
