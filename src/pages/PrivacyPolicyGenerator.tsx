
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const DEFAULT_POLICY = (data: {
  name: string;
  email: string;
  company: string;
  website: string;
}) => `
Privacy Policy for ${data.company || "[Your Company]"}

At ${data.company || "[Your Company]"}, accessible from ${data.website || "[your-website.com]"}, one of our main priorities is the privacy of our visitors. This Privacy Policy describes the types of information that is collected and recorded by ${data.company || "[Your Company]"} and how we use it.

**Contact Information**
If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${data.email || "[your@email.com]"}.

**Information We Collect**
We may collect personal identification information (name, email address, phone number, etc.), when you voluntarily submit such information through forms on our site.

**How We Use Your Information**
We use the information we collect for various purposes, including to:
- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Communicate with you, including for customer service and support
- Send emails

**Cookies and Web Beacons**
Like any other website, ${data.company || "[Your Company]"} uses cookies.

**Third-Party Privacy Policies**
Our Privacy Policy does not apply to other advertisers or websites.

**Children's Information**
We do not knowingly collect Personal Identifiable Information from children under 13.

**Consent**
By using our website, you consent to our Privacy Policy and agree to its terms.
`;

const PrivacyPolicyGenerator = () => {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [customPolicy, setCustomPolicy] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const policy = DEFAULT_POLICY({ name, company, email, website });
    setCustomPolicy(policy);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
            Privacy Policy Generator
            <span className="inline-flex h-6 w-6 rounded-full bg-blue-100 items-center justify-center">
              <span role="img" aria-label="lock" className="text-blue-500">🔒</span>
            </span>
          </CardTitle>
          <p className="text-muted-foreground">
            Generate a privacy policy for your website/app in seconds. Complete the fields and customize as needed.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-5">
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
              <Button type="submit" className="w-full md:w-auto mt-4">
                Generate Policy
              </Button>
            </div>
            <div className="flex flex-col h-full">
              <label className="mb-2 font-medium text-muted-foreground">
                Policy Preview (editable)
              </label>
              <Textarea
                className="flex-1 min-h-[300px] font-mono text-sm mb-2"
                value={showPreview ? customPolicy : ""}
                onChange={e => setCustomPolicy(e.target.value)}
                disabled={!showPreview}
              />
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
