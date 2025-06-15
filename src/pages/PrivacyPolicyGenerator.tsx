
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AdvancedPolicyOptions from "@/components/privacy/AdvancedPolicyOptions";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

type AdvancedOptions = {
  analytics: boolean;
  tracking: boolean;
  thirdParty: boolean;
  retention: boolean;
  cookies: boolean;
  userRights: boolean;
  dataSecurity: boolean;
  dataTypes: {
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    payment: boolean;
  };
  customSection: string;
};

const DEFAULT_ADVANCED: AdvancedOptions = {
  analytics: false,
  tracking: false,
  thirdParty: false,
  retention: false,
  cookies: true,
  userRights: false,
  dataSecurity: true,
  dataTypes: { name: true, email: true, phone: false, address: false, payment: false },
  customSection: ""
};

const getFormattedPolicy = (
  data: { name: string; email: string; company: string; website: string },
  options: AdvancedOptions,
  mode: "text" | "html" = "text"
) => {
  // Helper for sections
  function section(title: string, body: string) {
    if (mode === "html") {
      return `<h3 class='mt-6 mb-1 text-lg font-semibold'>${title}</h3><p>${body}</p>`;
    }
    return `**${title}**\n${body}\n`;
  }
  const collectedData = Object.entries(options.dataTypes)
    .filter(([, v]) => v)
    .map(([k]) => k[0].toUpperCase() + k.slice(1))
    .join(", ") || "basic information (name, email, etc.)";
  let policy = "";
  if (mode === "html") {
    policy += `<h2 class='text-2xl font-bold mb-2'>Privacy Policy for ${data.company || "[Your Company]"}</h2>`;
    policy += `<p>At <b>${data.company || "[Your Company]"}</b>, accessible from <b>${data.website || "[your-website.com]"}</b>, one of our main priorities is the privacy of our visitors.</p>`;
  } else {
    policy += `Privacy Policy for ${data.company || "[Your Company]"}\n\nAt ${data.company || "[Your Company]"}, accessible from ${data.website || "[your-website.com]"}, one of our main priorities is the privacy of our visitors.\n\n`;
  }

  // Contact section
  policy += section(
    "Contact Information",
    `If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${data.email || "[your@email.com]"}.`
  );
  // Collected information
  policy += section(
    "Information We Collect",
    `We may collect: ${collectedData}. This information is collected when you voluntarily submit it via forms on our site.`
  );
  // Use of information
  let uses = [
    "Provide, operate, and maintain our website",
    "Improve, personalize, and expand our website",
    "Communicate with you, including for customer service and support",
    "Send emails"
  ];
  if (options.analytics)
    uses.push("Analyze site usage (e.g., via analytics tools like Google Analytics)");
  if (options.tracking)
    uses.push("Deliver personalized ads or remarketing based on your behavior");
  if (options.cookies)
    uses.push("Maintain session state or remember preferences via cookies");
  policy += section(
    "How We Use Your Information",
    `<ul>${uses.map(u => mode === "html" ? `<li>${u}</li>` : `- ${u}`).join(mode === "html" ? "" : "\n")}</ul>`
  );

  // Cookies section
  if (options.cookies) {
    policy += section(
      "Cookies and Web Beacons",
      `We use cookies to store information including visitors' preferences and the pages on the website that the visitor accessed or visited.`
    );
  }
  // Analytics
  if (options.analytics) {
    policy += section(
      "Analytics",
      "We may use third-party analytics services (like Google Analytics) that collect, monitor, and analyze this type of information to increase our service's functionality."
    );
  }
  // Third-party sharing
  if (options.thirdParty) {
    policy += section(
      "Third-Party Privacy Policies",
      "Our Privacy Policy does not apply to other advertisers, partners, or websites. We may share information with trusted third parties for business operations, subject to confidentiality obligations."
    );
  }
  // Data retention
  if (options.retention) {
    policy += section(
      "Data Retention",
      "We retain your information only as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law."
    );
  }
  // User rights
  if (options.userRights) {
    policy += section(
      "Your Data Protection Rights",
      "You have the right to access, correct, delete, or restrict the use of your personal data. To do so, contact us at the email above."
    );
  }

  if (options.dataSecurity) {
    policy += section(
      "Data Security",
      "We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security."
    );
  }

  // Tracking/remarketing
  if (options.tracking) {
    policy += section(
      "Tracking Technologies",
      "We may use tracking scripts or remarketing tools to provide relevant advertising content."
    );
  }

  // Children's info
  policy += section(
    "Children's Information",
    "We do not knowingly collect Personally Identifiable Information from children under 13. If you believe your child provided this kind of information, contact us and we will promptly remove it."
  );
  // Consent
  policy += section(
    "Consent",
    "By using our website, you consent to our Privacy Policy and agree to its terms."
  );
  // Custom section
  if (options.customSection && options.customSection.trim().length > 3) {
    policy += section("Additional Clause", options.customSection);
  }
  return policy;
};

const PrivacyPolicyGenerator = () => {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [options, setOptions] = useState<AdvancedOptions>({ ...DEFAULT_ADVANCED });
  const [customPolicy, setCustomPolicy] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"text" | "html">("text");

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const policy = getFormattedPolicy({ name, company, email, website }, options, viewMode);
    setCustomPolicy(policy);
    setShowPreview(true);
  }

  function handleViewSwitch(mode: "text" | "html") {
    setViewMode(mode);
    // Regenerate preview to reflect mode
    if (showPreview) {
      setCustomPolicy(
        getFormattedPolicy({ name, company, email, website }, options, mode)
      );
    }
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <Card className="w-full mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </span>
            Advanced Privacy Policy Generator
          </CardTitle>
          <p className="text-muted-foreground pt-2">
            Generate a highly customizable, GDPR-friendly privacy policy. Toggle sections below and edit as needed.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <Input
                placeholder="Your Name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
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
              <Input
                placeholder="Contact Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="mt-6">
                <AdvancedPolicyOptions options={options} onChange={setOptions} />
              </div>
              <Button type="submit" className="w-full md:w-auto mt-6">
                Generate Policy
              </Button>
            </div>
            <div className="flex flex-col h-full">
              <label className="mb-2 font-medium text-muted-foreground flex items-center gap-3">
                Policy Preview <span className="ml-auto">
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
                    dangerouslySetInnerHTML={{ __html: customPolicy }}
                  />
                ) : (
                  <Textarea
                    className="flex-1 min-h-[300px] font-mono text-sm mb-2"
                    value={customPolicy}
                    onChange={e => setCustomPolicy(e.target.value)}
                  />
                )
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground text-center text-sm opacity-70 border rounded-md h-full min-h-[300px]">Your policy preview will appear here after generating.</div>
              )}
              {showPreview && (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(customPolicy);
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

export default PrivacyPolicyGenerator;
