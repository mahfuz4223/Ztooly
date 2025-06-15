import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Palette } from "lucide-react";
import PaletteSwatch from "@/components/PaletteSwatch";

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
  const [isFollowed, setIsFollowed] = useState(false);

  // Regenerate palettes on demand or mode/count change
  const regeneratePalette = () => {
    setFlatPalette(generateFlatPalette(count));
    setGradientPalette(generateGradientPalette(count));
    setMonoPalette(generateMonochromePalette(count));
    setPastelPalette(generatePastelPalette(count));
  };

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

  return (
    <div className="bg-background min-h-screen pb-8">
      {/* Professional Header */}
      <header className="bg-gradient-to-r from-blue-100 to-pink-100 border-b border-border mb-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() => navigate("/")}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Palette className="w-9 h-9 text-primary mr-2" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 tracking-tight">
              Color Palette Generator
            </h1>
            <span className="block text-muted-foreground text-[15px] leading-tight">
              Marketplace for unique, ready-to-copy beautiful palettes and gradients.
            </span>
          </div>
          <div className="ml-auto">
            <Button
              variant={isFollowed ? "default" : "secondary"}
              className="rounded-full px-5 py-2 shadow"
              onClick={() => setIsFollowed(f => !f)}
              aria-pressed={isFollowed}
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      </header>
      {/* Controls */}
      <section className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 pb-4">
        <div className="flex items-center w-full md:w-auto gap-2 md:mb-0">
          <div>
            <label className="font-medium text-muted-foreground block mb-1">Palette Type</label>
            <div className="flex gap-2 flex-wrap">
              {paletteModes.map((modeOpt) => (
                <Button
                  key={modeOpt.value}
                  type="button"
                  variant={mode === modeOpt.value ? "default" : "secondary"}
                  className="px-3 py-1 rounded-full"
                  onClick={() => setMode(modeOpt.value)}
                >
                  {modeOpt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <label className="font-medium text-muted-foreground block mb-1">Colors</label>
            <Input
              type="number"
              min={2}
              max={12}
              value={count}
              onChange={handleCountChange}
              className="w-24 text-center"
            />
            <span className="text-xs text-muted-foreground block mt-1 text-center">
              (2–12)
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-w-[100px]"
            onClick={regeneratePalette}
          >
            Regenerate
          </Button>
        </div>
      </section>
      {/* Card "Marketplace" Showcase */}
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full mx-auto shadow-lg animate-fade-in">
          <CardContent>
            <div className="mt-6 mb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {mode === "gradient"
                ? current.map(
                    (
                      grad: { from: string; to: string; direction: string },
                      idx: number
                    ) => (
                      <PaletteSwatch
                        key={idx}
                        color=""
                        gradient={grad}
                        index={idx}
                        mode="gradient"
                      />
                    )
                  )
                : current.map((color: string, idx: number) => (
                    <PaletteSwatch
                      key={idx}
                      color={color}
                      index={idx}
                      mode={mode as any}
                    />
                  ))}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-6">
              Tap a swatch to copy. <br />
              <span className="font-medium">Regenerate</span> for new palettes, <span className="font-medium">Follow</span> to explore more!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
