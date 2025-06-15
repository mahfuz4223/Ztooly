
import React from "react";

export default function HelpCenter() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="text-muted-foreground mb-4">
        Welcome to the Help Center. Here you can find answers to frequently asked questions, guides, and support resources for using ToolKit.
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>
          <strong>General:</strong> ToolKit is free to use for everyone!
        </li>
        <li>
          <strong>Need assistance?</strong> Reach out via our <a href="/contact" className="text-primary underline">Contact Page</a>.
        </li>
        <li>
          <strong>Feedback:</strong> Suggestions and bug reports are always welcome!
        </li>
      </ul>
    </div>
  );
}
