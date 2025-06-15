
import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">
        Your privacy is important to us. We never sell your data and we strive to keep your information safe.
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>
          We do not share personal information with third parties.
        </li>
        <li>
          Data is only used to improve the quality of the service.
        </li>
        <li>
          Questions? Contact us through our <a href="/contact" className="text-primary underline">Contact Page</a>.
        </li>
      </ul>
    </div>
  );
}
