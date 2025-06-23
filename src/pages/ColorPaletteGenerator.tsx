import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGeneratorToolAnalytics } from "@/utils/analyticsHelper";
import { UsageStats } from "@/components/UsageStats";

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

export default function ColorPaletteGenerator() {
  // Enhanced Analytics tracking
  const analytics = useGeneratorToolAnalytics('color-palette-generator', 'Color Palette Generator');
  
  const [colors, setColors] = useState<string[]>([]);
  const [numColors, setNumColors] = useState<number>(5);

  useEffect(() => {
    generatePalette();
  }, []);

  const generatePalette = () => {
    const newColors = Array.from({ length: numColors }, () => generateRandomColor());
    setColors(newColors);
    analytics.trackGenerate();
  };

  const handleColorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10);
    if (newCount > 0 && newCount <= 10) {
      setNumColors(newCount);
    }
  };
  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      analytics.trackCopy();
      toast({
        title: "Copied!",
        description: `${color} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy!",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* Removed local nav/back btn, use only global nav */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          🎨 Color Palette Generator
        </h1>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-purple-100 items-center justify-center">
            <span role="img" aria-label="palette" className="text-purple-500 text-2xl">🌈</span>
          </span>
        </div>
      </div>
      <div className="max-w-3xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Generate beautiful color palettes for your designs in seconds!
      </div>
      {/* Main content */}
      <div className="min-h-screen bg-background py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <label htmlFor="colorCount" className="text-sm font-medium text-muted-foreground">Number of Colors (1-10):</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    id="colorCount"
                    className="w-20 text-center"
                    value={numColors}
                    onChange={handleColorCountChange}
                    min="1"
                    max="10"
                  />
                  <Button variant="outline" size="sm" onClick={generatePalette}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((color, index) => (
              <Card key={index} className="shadow-md">
                <div
                  className="h-24"
                  style={{ backgroundColor: color }}
                />
                <CardContent className="flex items-center justify-between p-3">
                  <span className="text-sm font-mono text-muted-foreground">{color}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(color)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>            ))}
          </div>

          {/* Usage Statistics */}
          <UsageStats toolId="color-palette-generator" />
        </div>
      </div>
    </div>
  );
}
