
import React from "react";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="text-muted-foreground mb-4">
        Reach out to us with questions, feedback, or support requests.
      </p>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="name">Name</label>
          <input
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
            id="name"
            type="text"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
            id="email"
            type="email"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="message">Message</label>
          <textarea
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
            id="message"
            rows={4}
            placeholder="Type your message here..."
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
