
import { useEffect } from "react";

/**
 * Usage: 
 * <Ads variant="banner1" /> or <Ads variant="banner2" />
 * To open Direct Link ad: call openDirectAdLink()
 */

// Direct Links ad: use this function to open the ad in a new tab
export function openDirectAdLink() {
  window.open("https://www.profitableratecpm.com/wxdpzi4q0h?key=c74a90b707a44d713e4a2858954b7748", "_blank", "noopener,noreferrer");
}

type AdsProps = {
  variant?: "banner1" | "banner2";
  className?: string;
};

export default function Ads({ variant = "banner1", className }: AdsProps) {
  useEffect(() => {
    if (variant === "banner1") {
      // Load Adsterra script for container-3a601b714d111497b7c34a7a0199e13d
      const script = document.createElement("script");
      script.src = "//pl26918936.profitableratecpm.com/3a601b714d111497b7c34a7a0199e13d/invoke.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      const root = document.getElementById("container-3a601b714d111497b7c34a7a0199e13d-root");
      if (root) {
        root.appendChild(script);
      }

      // Cleanup
      return () => {
        const el = document.getElementById("container-3a601b714d111497b7c34a7a0199e13d-root");
        if (el) el.innerHTML = "";
      };
    }
    if (variant === "banner2") {
      // Load the JS file for the second ad (script only, no container div)
      const findId = "c3ef425c8613967d927958aded4451b7-ad";
      // Avoid duplicating the script
      if (!document.getElementById(findId)) {
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "//pl26920129.profitableratecpm.com/c3/ef/42/c3ef425c8613967d927958aded4451b7.js";
        s.id = findId;
        document.body.appendChild(s);
      }
      // No cleanup for this ad as it's appended to body
    }
  }, [variant]);

  if (variant === "banner1") {
    // Needs a container for the first banner
    return (
      <div className={className ?? ""}>
        <div id="container-3a601b714d111497b7c34a7a0199e13d-root">
          <div id="container-3a601b714d111497b7c34a7a0199e13d" />
        </div>
      </div>
    );
  }
  // Can further style or place the banner2 differently if needed
  return <></>;
}
