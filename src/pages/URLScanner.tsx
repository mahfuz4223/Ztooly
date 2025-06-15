
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("scanning");
    setError("");
    setLinks([]);
    // Basic validation
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;
    try {
      // Try to fetch html using CORS (some sites may block)
      const res = await fetch(target, {
        mode: "cors"
      });
      if (!res.ok) throw new Error(`HTTP error (${res.status})`);
      const html = await res.text();
      const found = extractLinksFromHtml(html, target);
      setLinks(found);
      setStatus("done");
    } catch (err: any) {
      setError("Could not fetch or parse this URL. (CORS may block some sites.)");
      setStatus("error");
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
        <h1 className="text-2xl md:text-3xl font-bold">
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
                <h2 className="font-semibold mb-2">Links found: {links.length}</h2>
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
          Note: Some sites may not allow scanning due to CORS. Only public pages with readable HTML will show results.<br />
          Inspired by <a href="https://colorhunt.co/" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">colorhunt.co</a> style simplicity.
        </div>
      </main>
    </div>
  );
};

export default URLScanner;
