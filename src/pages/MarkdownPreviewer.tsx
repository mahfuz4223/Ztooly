
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const DEFAULT_MARKDOWN = `# Markdown to HTML Previewer

Type some *Markdown* on the left and see the **HTML** preview on the right!

- Type live
- See preview instantly
- Toggle between rendered HTML and raw HTML output
`;

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [showRendered, setShowRendered] = useState(true);
  const navigate = useNavigate();

  const html = marked.parse(markdown);

  return (
    <div>
      {/* Header with Back button and page info */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() => navigate("/")}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            📝 Markdown Previewer
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
            <span role="img" aria-label="markdown" className="text-orange-500 text-2xl">🔥</span>
          </span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Instantly preview and convert Markdown to HTML. User-friendly and responsive!
      </div>

      {/* Main Card */}
      <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col h-full">
                <label className="mb-2 font-medium text-muted-foreground">Markdown Input</label>
                <Textarea
                  className="flex-1 min-h-[200px] font-mono text-sm mb-2"
                  value={markdown}
                  onChange={e => setMarkdown(e.target.value)}
                  placeholder="Write Markdown here!"
                />
              </div>
              <div className="flex flex-col h-full">
                <label className="mb-2 font-medium text-muted-foreground flex items-center gap-3">
                  Preview
                  <span className="ml-auto">
                    <Switch
                      checked={showRendered}
                      onCheckedChange={on => setShowRendered(on)}
                    /> Rendered HTML
                  </span>
                </label>
                {showRendered ? (
                  <div
                    className="flex-1 min-h-[200px] font-sans text-base mb-2 p-4 rounded border bg-background shadow-inner overflow-y-auto prose max-w-none"
                    style={{ background: "#fcfcfc" }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ) : (
                  <Textarea
                    className="flex-1 min-h-[200px] font-mono text-sm mb-2"
                    value={html}
                    readOnly
                  />
                )}
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(showRendered ? html : markdown);
                    toast({ title: "Copied!", description: showRendered ? "HTML code copied." : "Markdown copied." });
                  }}
                >
                  Copy {showRendered ? "HTML" : "Markdown"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
