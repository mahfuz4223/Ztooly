
import React from "react";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>      <p className="text-muted-foreground mb-4">
        By using Ztooly, you agree to the following terms:
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Ztooly is provided as-is, without warranties of any kind.</li>
        <li>You agree not to misuse our free tools for unlawful activity.</li>
        <li>We reserve the right to update these terms at any time.</li>
      </ul>
      <p className="text-muted-foreground mt-4">
        If you have questions, please <a href="/contact" className="text-primary underline">contact us</a>.
      </p>
    </div>
  );
}
