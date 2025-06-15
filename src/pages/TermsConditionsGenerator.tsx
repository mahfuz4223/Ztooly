
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AdvancedTermsOptions from "@/components/terms/AdvancedTermsOptions";
import { Switch } from "@/components/ui/switch";

type AdvancedTermsOptions = {
  returns: boolean;
  liability: boolean;
  governingLaw: boolean;
  dataUse: boolean;
  cookies: boolean;
  termination: boolean;
  disclaimer: boolean;
  customSection: string;
};

const DEFAULT_ADVANCED: AdvancedTermsOptions = {
  returns: true,
  liability: true,
  governingLaw: true,
  dataUse: true,
  cookies: true,
  termination: true,
  disclaimer: true,
  customSection: "",
};

const getFormattedTerms = (
  data: { company: string; website: string },
  options: AdvancedTermsOptions,
  mode: "text" | "html" = "text"
) => {
  function section(title: string, body: string) {
    if (mode === "html") {
      return `<h3 class='mt-6 mb-1 text-lg font-semibold'>${title}</h3><p>${body}</p>`;
    }
    return `**${title}**\n${body}\n`;
  }

  let terms = "";
  if (mode === "html") {
    terms += `<h2 class='text-2xl font-bold mb-2'>Terms & Conditions for ${data.company || "[Your Company]"}</h2>`;
    terms += `<p>Please read these terms and conditions carefully before using the ${data.website || "[your-website.com]"} website or services operated by <b>${data.company || "[Your Company]"}</b>.</p>`;
  } else {
    terms += `Terms & Conditions for ${data.company || "[Your Company]"}\n\nPlease read these terms and conditions carefully before using the ${data.website || "[your-website.com]"} website or services operated by ${data.company || "[Your Company]" }.\n\n`;
  }

  // Use of service
  terms += section(
    "Acceptance of Terms",
    "By accessing or using our website or services, you agree to be bound by these Terms & Conditions."
  );

  if (options.dataUse) {
    terms += section(
      "Data Use & Privacy",
      "Your use of our service is also governed by our Privacy Policy. Please review our privacy practices prior to use."
    );
  }

  if (options.cookies) {
    terms += section(
      "Cookies",
      "We may use cookies and similar technologies in accordance with our Privacy Policy."
    );
  }

  terms += section(
    "User Responsibilities",
    "You must use the website and services in compliance with all applicable laws and regulations and must not misuse the service."
  );

  // Returns/refund
  if (options.returns) {
    terms += section(
      "Returns and Refunds",
      "If applicable, our Returns and Refunds Policy describes your rights regarding refunds. Please review it carefully."
    );
  }

  // Limitation of liability
  if (options.liability) {
    terms += section(
      "Limitation of Liability",
      "To the fullest extent permitted by law, we shall not be held liable for any damages resulting from your use of our website or services."
    );
  }

  // Disclaimer
  if (options.disclaimer) {
    terms += section(
      "Disclaimer",
      "Our website and services are provided on an 'as is' and 'as available' basis. We make no guarantees as to the accuracy, completeness, or timeliness of the content."
    );
  }

  // Termination
  if (options.termination) {
    terms += section(
      "Termination",
      "We reserve the right to terminate or suspend access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms."
    );
  }

  // Governing law
  if (options.governingLaw) {
    terms += section(
      "Governing Law",
      "These Terms shall be governed by and construed in accordance with the laws of your country or region."
    );
  }

  // Custom
  if (options.customSection && options.customSection.trim().length > 3) {
    terms += section("Additional Clause", options.customSection);
  }

  // Final clause
  terms += section(
    "Contact Us",
    "If you have any questions about these Terms, please contact us through the website."
  );

  return terms;
};

const TermsConditionsGenerator = () => {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [options, setOptions] = useState<AdvancedTermsOptions>({ ...DEFAULT_ADVANCED });
  const [customTerms, setCustomTerms] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"text" | "html">("text");

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const terms = getFormattedTerms({ company, website }, options, viewMode);
    setCustomTerms(terms);
    setShowPreview(true);
  }

  function handleViewSwitch(mode: "text" | "html") {
    setViewMode(mode);
    if (showPreview) {
      setCustomTerms(
        getFormattedTerms({ company, website }, options, mode)
      );
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
            Advanced Terms & Conditions Generator
            <span className="inline-flex h-6 w-6 rounded-full bg-orange-100 items-center justify-center">
              <span role="img" aria-label="scroll" className="text-orange-500">📜</span>
            </span>
          </CardTitle>
          <p className="text-muted-foreground">
            Instantly create professional Terms & Conditions for your website or product with advanced, customizable clauses.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                placeholder="Company/Website Name"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
              />
              <Input
                placeholder="Website URL (https://...)"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                required
              />
              <div className="mt-6">
                <AdvancedTermsOptions options={options} onChange={setOptions} />
              </div>
              <Button type="submit" className="w-full md:w-auto mt-6">
                Generate Terms & Conditions
              </Button>
            </div>
            <div className="flex flex-col h-full">
              <label className="mb-2 font-medium text-muted-foreground flex items-center gap-3">
                Preview
                <span className="ml-auto">
                  <Switch
                    checked={viewMode === "html"}
                    onCheckedChange={on => handleViewSwitch(on ? "html" : "text")}
                  /> Rendered (HTML)
                </span>
              </label>
              {/* Text or HTML policy rendering */}
              {showPreview ? (
                viewMode === "html" ? (
                  <div
                    className="flex-1 min-h-[300px] font-sans text-base mb-2 p-4 rounded border bg-background shadow-inner overflow-y-auto prose max-w-none"
                    style={{ background: "#fcfcfc" }}
                    dangerouslySetInnerHTML={{ __html: customTerms }}
                  />
                ) : (
                  <Textarea
                    className="flex-1 min-h-[300px] font-mono text-sm mb-2"
                    value={customTerms}
                    onChange={e => setCustomTerms(e.target.value)}
                  />
                )
              ) : (
                <div className="p-8 text-muted-foreground text-center text-sm opacity-70">Your T&amp;C preview will appear here after generating.</div>
              )}
              {showPreview && (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(customTerms);
                  }}
                >
                  Copy to Clipboard
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditionsGenerator;
