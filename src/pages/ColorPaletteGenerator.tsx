
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Utility Functions
function randomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
}

function randomHSL() {
  return `hsl(${Math.floor(Math.random() * 360)}, ${
    40 + Math.round(Math.random() * 60)
  }%, ${40 + Math.round(Math.random() * 20)}%)`;
}

function generateFlatPalette(n: number) {
  return Array.from({ length: n }, () => randomHexColor());
}

function generateGradientPalette(n: number) {
  // Each gradient will be an object: {from, to, direction}
  const directions = [
    "to right",
    "to bottom",
    "to top right",
    "to left",
    "135deg",
    "90deg",
  ];
  return Array.from({ length: n }, () => {
    return {
      from: randomHexColor(),
      to: randomHexColor(),
      direction: directions[Math.floor(Math.random() * directions.length)],
    };
  });
}

function generateMonochromePalette(n: number) {
  const baseHue = Math.floor(Math.random() * 360);
  return Array.from({ length: n }, (_, i) =>
    `hsl(${baseHue}, 60%, ${40 + i * (40 / n)}%)`
  );
}

function generatePastelPalette(n: number) {
  return Array.from({ length: n }, () => {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h}, 70%, 85%)`;
  });
}

const paletteModes = [
  { label: "Flat Colors", value: "flat" },
  { label: "Gradient", value: "gradient" },
  { label: "Monochrome", value: "mono" },
  { label: "Pastel", value: "pastel" },
];

export default function ColorPaletteGenerator() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(paletteModes[0].value);
  const [count, setCount] = useState(6);
  const [flatPalette, setFlatPalette] = useState(generateFlatPalette(count));
  const [gradientPalette, setGradientPalette] = useState(generateGradientPalette(count));
  const [monoPalette, setMonoPalette] = useState(generateMonochromePalette(count));
  const [pastelPalette, setPastelPalette] = useState(generatePastelPalette(count));

  // Regenerate palettes on demand or mode/count change
  const regeneratePalette = () => {
    setFlatPalette(generateFlatPalette(count));
    setGradientPalette(generateGradientPalette(count));
    setMonoPalette(generateMonochromePalette(count));
    setPastelPalette(generatePastelPalette(count));
  };

  // Handle palette size changes
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(2, Math.min(12, Number(e.target.value) || 6));
    setCount(val);
    setTimeout(regeneratePalette, 0);
  };

  // Current palette
  let current;
  if (mode === "flat") current = flatPalette;
  if (mode === "gradient") current = gradientPalette;
  if (mode === "mono") current = monoPalette;
  if (mode === "pastel") current = pastelPalette;

  // Palette display
  return (
    <div>
      {/* Header */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-8 pb-4">
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
            🎨 Color Palette Generator
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-flex h-10 w-10 rounded-full bg-gradient-to-tr from-pink-300 via-yellow-300 to-blue-400 items-center justify-center shadow">
            <span role="img" aria-label="palette" className="text-2xl">🌈</span>
          </span>
        </div>
      </div>
      <div className="max-w-3xl mx-auto text-muted-foreground px-4 -mt-4 mb-3 text-base">
        Generate beautiful color palettes—flat, monochrome, pastel, or stunning gradients. Copy to clipboard and use instantly!
      </div>
      {/* Main Card */}
      <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 mt-6 items-end">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Palette Type</label>
                <div className="flex gap-2">
                  {paletteModes.map((modeOpt) => (
                    <Button
                      key={modeOpt.value}
                      type="button"
                      variant={mode === modeOpt.value ? "default" : "secondary"}
                      className="px-3 py-1 rounded"
                      onClick={() => setMode(modeOpt.value)}
                    >
                      {modeOpt.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Colors</label>
                <Input
                  type="number"
                  min={2}
                  max={12}
                  value={count}
                  onChange={handleCountChange}
                  className="w-20 text-center"
                />
                <span className="text-xs text-muted-foreground block mt-1 text-center">
                  (2–12)
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="ml-auto min-w-[100px]"
                onClick={regeneratePalette}
              >
                Regenerate
              </Button>
            </div>

            {/* Palette Swatches */}
            <div className="mt-8 mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {mode === "gradient"
                ? current.map(
                    (
                      grad: { from: string; to: string; direction: string },
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center group gap-1"
                      >
                        <div
                          className="h-16 w-16 rounded shadow border transition-all cursor-pointer"
                          style={{
                            background: `linear-gradient(${grad.direction}, ${grad.from}, ${grad.to})`,
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `linear-gradient(${grad.direction}, ${grad.from}, ${grad.to})`
                            );
                            toast({
                              title: "Copied!",
                              description: "Gradient CSS copied to clipboard.",
                            });
                          }}
                        />
                        <button
                          className="text-xs text-muted-foreground transition hover:text-foreground"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `linear-gradient(${grad.direction}, ${grad.from}, ${grad.to})`
                            );
                            toast({ title: "Copied!", description: "Gradient CSS copied!" });
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    )
                  )
                : current.map((color: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center group gap-1"
                    >
                      <div
                        className="h-16 w-16 rounded shadow border transition-all cursor-pointer"
                        style={{ background: color }}
                        onClick={() => {
                          navigator.clipboard.writeText(color);
                          toast({
                            title: "Copied!",
                            description: `Color ${color} copied to clipboard.`,
                          });
                        }}
                      />
                      <button
                        className="text-xs text-muted-foreground transition hover:text-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(color);
                          toast({
                            title: "Copied!",
                            description: `Color ${color} copied!`,
                          });
                        }}
                      >
                        {color.startsWith("#") ? color : color.replace("hsl", "HSL")}
                      </button>
                    </div>
                  ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Tap a color or gradient to copy. Regenerate for new palettes!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
