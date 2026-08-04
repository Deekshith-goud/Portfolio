import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Deekshith Goud",
  description: "How things work under the hood regarding your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-16 py-24 min-h-screen font-sans">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
          Privacy Stuff
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Last updated: August {new Date().getFullYear()}
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
        <p className="text-lg">
          Hey there! Let&apos;s keep this quick and casual. I respect your privacy, so here&apos;s a plain-English breakdown of what happens under the hood while you browse my portfolio. Spoiler alert: I don&apos;t sell or hoard your data!
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800 dark:text-zinc-100">
          1. The &quot;Good Evening&quot; Greeting
        </h2>
        <p>
          You might see a cool personalized greeting at the top of the page (like <em>&quot;GOOD EVENING VISITOR FROM ...&quot;</em>). To do this, your browser quickly pings a service called <code>ipinfo.io</code> to guess your general region and timezone. 
        </p>
        <p>
          Don&apos;t worry—that location info stays right in your browser&apos;s temporary memory (session storage) so the banner loads smoothly. It is <strong>never</strong> sent to my database or saved anywhere on my end. Once you close the tab, it&apos;s gone.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800 dark:text-zinc-100">
          2. The Visitor Counter
        </h2>
        <p>
          There&apos;s a fun little visitor counter down in the footer. Instead of being creepy and logging your IP address to figure out if you&apos;ve visited before, I use a privacy-friendly trick:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your browser generates a random, anonymous string of gibberish (a UUID).</li>
          <li>It scrambles that string into a hash (SHA-256) before it ever reaches my server.</li>
          <li>It saves that hash in your browser&apos;s local storage so you aren&apos;t counted twice if you refresh the page.</li>
        </ul>
        <p className="mt-4">
          Basically, the counter knows <em>someone</em> visited, but has absolutely zero idea <em>who</em> you are.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800 dark:text-zinc-100">
          3. The Visitor Canvas (Marks Gallery)
        </h2>
        <p>
          If you decide to draw a masterpiece on the Visitor Canvas, the coordinates of your drawing and the name you type are saved to my Sanity database so everyone else can admire your work in the gallery.
        </p>
        <p>
          Your artwork is linked to that same anonymous hash I mentioned above. Unless you explicitly write your real name on the canvas, your drawing is completely anonymous.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800 dark:text-zinc-100">
          4. Analytics (Vercel & Umami)
        </h2>
        <p>
          I use basic, privacy-friendly analytics (Vercel Analytics and Umami) just to see general trends—like which blog posts are popular or what countries people are visiting from. These tools collect anonymized, aggregated data. They don&apos;t use tracking cookies, and they don&apos;t stalk you across the internet.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800 dark:text-zinc-100">
          Got Questions?
        </h2>
        <p>
          If you have any questions about this, or if you ever want me to scrub your drawing from the canvas, just shoot me an email or a DM on my socials. Have fun exploring!
        </p>
      </div>
    </main>
  );
}
