
import React from "react";
import { toast } from "@/hooks/use-toast";

interface PaletteSwatchProps {
  color: string;
  index: number;
  gradient?: { from: string; to: string; direction: string };
  mode: "flat" | "mono" | "pastel" | "gradient";
  format?: "hex" | "rgb" | "hsl";
}

// Conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
  }
  if (hex.length !== 6) return null;
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function rgbToStr(rgb: {r: number, g: number, b: number}) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
function hexToHsl(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2-max-min) : d / (max+min);
    switch(max) {
      case r: h = (g-b)/d + (g < b ? 6 : 0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}

function hslToRgbStr(hslString: string): string {
  // Input like "hsl(36, 100%, 50%)"
  const m = /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/.exec(hslString.replace(/\s/g,""));
  if (!m) return hslString;
  let [h,s,l]=[parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
  s/=100;l/=100;let c=(1-Math.abs(2*l-1))*s;let x=c*(1-Math.abs((h/60)%2-1));let m1=l-c/2;let [r,g,b]=[0,0,0];
  if (h<60) [r,g,b]=[c,x,0];
  else if (h<120) [r,g,b]=[x,c,0];
  else if (h<180) [r,g,b]=[0,c,x];
  else if (h<240) [r,g,b]=[0,x,c];
  else if (h<300) [r,g,b]=[x,0,c];
  else [r,g,b]=[c,0,x];
  r=Math.round((r+m1)*255);g=Math.round((g+m1)*255);b=Math.round((b+m1)*255);
  return `rgb(${r}, ${g}, ${b})`;
}

function hslStringToHex(hslString: string): string {
  // Use rgb conversion
  // input: "hsl(36, 100%, 50%)"
  const m = /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/.exec(hslString.replace(/\s/g,""));
  if (!m) return hslString;
  let [h,s,l]=[parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
  s/=100;
  l/=100;
  let c=(1-Math.abs(2*l-1))*s;
  let x=c*(1-Math.abs((h/60)%2-1));
  let m1=l-c/2;
  let [r,g,b]=[0,0,0];
  if (h<60) [r,g,b]=[c,x,0];
  else if (h<120) [r,g,b]=[x,c,0];
  else if (h<180) [r,g,b]=[0,c,x];
  else if (h<240) [r,g,b]=[0,x,c];
  else if (h<300) [r,g,b]=[x,0,c];
  else [r,g,b]=[c,0,x];
  r=Math.round((r+m1)*255);
  g=Math.round((g+m1)*255);
  b=Math.round((b+m1)*255);
  return rgbToHex(r,g,b);
}

function getFormattedColor(color: string, format: "hex"|"rgb"|"hsl" = "hex") {
  if (color.startsWith("#")) {
    if (format === "hex") return color.toUpperCase();
    if (format === "rgb") {
      const rgb = hexToRgb(color);
      return rgb ? rgbToStr(rgb) : color;
    }
    if (format === "hsl") {
      const hsl = hexToHsl(color);
      return hsl ? hsl : color;
    }
    return color;
  } else if (color.startsWith("hsl")) {
    if (format === "hsl") return color;
    if (format === "rgb") return hslToRgbStr(color);
    if (format === "hex") return hslStringToHex(color);
    return color;
  } else if (color.startsWith("rgb")) {
    // rgb input
    if (format === "rgb") return color;
    // Try to extract components
    const m = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(color.replace(/\s/g,""));
    if (!m) return color;
    const [r,g,b] = [parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
    if (format === "hex") return rgbToHex(r,g,b);
    // Convert to hsl
    let [R,G,B] = [r/255,g/255,b/255];
    const max = Math.max(R,G,B), min = Math.min(R,G,B);
    let h = 0,s=0,l=(max+min)/2;
    if (max!==min) {
      const d = max-min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case R: h = (G-B)/d + (G<B?6:0); break;
        case G: h = (B-R)/d+2; break;
        case B: h = (R-G)/d+4; break;
      }
      h/=6;
    }
    return `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
  } else {
    return color; // fallback
  }
}

const PaletteSwatch: React.FC<PaletteSwatchProps> = ({
  color,
  gradient,
  index,
  mode,
  format = "hex",
}) => {
  // Setup background and code to display
  let code = color;
  let backgroundStyle: React.CSSProperties = {};

  if (gradient) {
    code = `linear-gradient(${gradient.direction}, ${gradient.from}, ${gradient.to})`;
    backgroundStyle.background = code;
  } else if (color.startsWith("#") || color.startsWith("hsl") || color.startsWith("rgb")) {
    backgroundStyle.background = color;
  }

  // For display/copy
  // For gradient: show both stops in format, copy as linear-gradient
  let displayCode = code;
  let codeToCopy = code;
  if (mode !== "gradient") {
    displayCode = getFormattedColor(color, format);
    codeToCopy = displayCode;
  } else if (gradient) {
    // For gradients: show both in format
    const from = getFormattedColor(gradient.from, format);
    const to = getFormattedColor(gradient.to, format);
    displayCode = `${from} → ${to}`;
    codeToCopy = `linear-gradient(${gradient.direction}, ${from}, ${to})`;
  }

  return (
    <div className="flex flex-col items-center bg-card rounded-xl shadow p-2 hover:shadow-lg transition group w-full">
      <div
        className="h-16 w-16 rounded-lg border shadow cursor-pointer"
        style={backgroundStyle}
        title={codeToCopy}
        onClick={() => {
          navigator.clipboard.writeText(codeToCopy);
          toast({
            title: "Copied!",
            description:
              (mode === "gradient"
                ? "Gradient CSS"
                : "Color code") + " copied to clipboard.",
          });
        }}
      />
      {/* Always show formatted color/code except for gradients which have from → to */}
      <span className="mt-1 text-xs font-mono text-muted-foreground text-center">{displayCode}</span>
      {mode === "gradient" && (
        <span className="text-[10px] text-muted-foreground">{gradient?.direction}</span>
      )}
      <button
        className="text-xs mt-1 text-primary-foreground bg-primary px-2 py-1 rounded hover:scale-105 transition"
        onClick={() => {
          navigator.clipboard.writeText(codeToCopy);
          toast({
            title: "Copied!",
            description:
              (mode === "gradient"
                ? "Gradient CSS"
                : "Color code") + " copied!",
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

