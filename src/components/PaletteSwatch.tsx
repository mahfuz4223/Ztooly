
import React from "react";
import { toast } from "@/hooks/use-toast";

interface PaletteSwatchProps {
  color: string;
  index: number;
  gradient?: { from: string; to: string; direction: string };
  mode: "flat" | "mono" | "pastel" | "gradient";
}

const PaletteSwatch: React.FC<PaletteSwatchProps> = ({
  color,
  gradient,
  index,
  mode,
}) => {
  // Support gradients
  let code = color;
  let backgroundStyle: React.CSSProperties = {};

  if (gradient) {
    code = `linear-gradient(${gradient.direction}, ${gradient.from}, ${gradient.to})`;
    backgroundStyle.background = code;
  } else if (color.startsWith("#") || color.startsWith("hsl")) {
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
            description:
              (mode === "gradient"
                ? "Gradient CSS"
                : "Color code") + " copied to clipboard.",
          });
        }}
      />
      {/* Display code for all types */}
      {mode !== "gradient" && (
        <span className="mt-1 text-xs font-mono text-muted-foreground">{code}</span>
      )}
      {mode === "gradient" && (
        <>
          <span className="mt-1 text-xs font-mono text-muted-foreground text-center">
            {gradient?.from}→<br />
            {gradient?.to}
          </span>
          <span className="text-[10px] text-muted-foreground">{gradient?.direction}</span>
        </>
      )}
      {/* Remove color name */}
      <button
        className="text-xs mt-1 text-primary-foreground bg-primary px-2 py-1 rounded hover:scale-105 transition"
        onClick={() => {
          navigator.clipboard.writeText(code);
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

