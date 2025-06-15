
import React from "react";
import { toast } from "@/hooks/use-toast";
import namelist from "color-name-list";
// ---^ FIX: This should be a named import, so:
// import namelist from "color-name-list";
import * as namelistData from "color-name-list";
// Now use namelistData.default or just namelistData if it's the list

interface PaletteSwatchProps {
  color: string;
  index: number;
  gradient?: { from: string; to: string; direction: string };
  mode: "flat" | "mono" | "pastel" | "gradient";
}
function getColorName(hex: string): string {
  if (!hex.startsWith("#") || hex.length < 4) return "";
  // Find the closest match for the provided hex color
  let minDist = Number.MAX_VALUE;
  let name = "";
  // Use Array.isArray to ensure we have the color list
  const colorList = Array.isArray((namelistData as any).default)
    ? (namelistData as any).default
    : (namelistData as any);
  for (const n of colorList) {
    const dist = colorDistance(hex, n.hex);
    if (dist < minDist) {
      minDist = dist;
      name = n.name;
    }
  }
  return name || "Unnamed";
}

// Simple color hex distance for similarity
function colorDistance(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 99999;
  return (
    Math.abs(rgb1.r - rgb2.r) +
    Math.abs(rgb1.g - rgb2.g) +
    Math.abs(rgb1.b - rgb2.b)
  );
}
function hexToRgb(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
  }
  if (hex.length !== 6) return null;
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

const PaletteSwatch: React.FC<PaletteSwatchProps> = ({
  color,
  gradient,
  index,
  mode,
}) => {
  // Support gradients
  let displayColor = color;
  let code = color;
  let name = "";
  let backgroundStyle: React.CSSProperties = {};

  if (gradient) {
    displayColor = "";
    code = `linear-gradient(${gradient.direction}, ${gradient.from}, ${gradient.to})`;
    name = "Custom Gradient";
    backgroundStyle.background = code;
  } else if (color.startsWith("#")) {
    name = getColorName(color);
    backgroundStyle.background = color;
  } else if (color.startsWith("hsl")) {
    name = "HSL Color";
    backgroundStyle.background = color;
  }

  return (
    <div className="flex flex-col items-center bg-card rounded-xl shadow p-2 hover:shadow-lg transition group w-full">
      <div
        className="h-16 w-16 rounded-lg border shadow cursor-pointer"
        style={backgroundStyle}
        title={code}
        onClick={() => {
          navigator.clipboard.writeText(code);
          toast({
            title: "Copied!",
            description: (mode === "gradient" ? "Gradient CSS" : "Color code") + " copied to clipboard.",
          });
        }}
      />
      {mode !== "gradient" && (
        <span className="mt-1 text-xs font-mono text-muted-foreground">{code}</span>
      )}
      {mode === "gradient" && (
        <>
          <span className="mt-1 text-xs font-mono text-muted-foreground text-center">{gradient?.from}→<br />{gradient?.to}</span>
          <span className="text-[10px] text-muted-foreground">{gradient?.direction}</span>
        </>
      )}
      <span className="text-xs mt-1 text-center text-foreground font-semibold">
        {name}
      </span>
      <button
        className="text-xs mt-1 text-primary-foreground bg-primary px-2 py-1 rounded hover:scale-105 transition"
        onClick={() => {
          navigator.clipboard.writeText(code);
          toast({
            title: "Copied!",
            description: (mode === "gradient" ? "Gradient CSS" : "Color code") + " copied!",
          });
        }}
        tabIndex={-1}
      >
        Copy
      </button>
    </div>
  );
};

export default PaletteSwatch;

