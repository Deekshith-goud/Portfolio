"use client";

import {
  BiLogoTwitter,
  BiLogoLinkedinSquare,
  BiLogoFacebookSquare,
  BiLogoWhatsapp,
} from "react-icons/bi";

type props = {
  title: string;
  slug: string;
  description: string;
};

export default function SharePost({ title, slug, description }: props) {
  const blog = "https://deekshith-goud.vercel.app/blog/";
  const options = [
    {
      icon: BiLogoTwitter,
      name: "Twitter",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Thank you Deekshith Goud for writing this post.\n\n${title}\n\n${blog}${slug}`
      )}`,
    },
    {
      icon: BiLogoLinkedinSquare,
      name: "LinkedIn",
      shareUrl: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        `${blog}${slug}`
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    },
    {
      icon: BiLogoFacebookSquare,
      name: "Facebook",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        `${blog}${slug}`
      )}`,
    },
    {
      icon: BiLogoWhatsapp,
      name: "WhatsApp",
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Read this amazing article by Deekshith Goud.\n\n${title}\n\n${blog}${slug}`
      )}`,
    },
  ];

  const openPopup = (url: string) => {
    window.open(
      url,
      "Social Share",
      "width=600,height=600,resizable=yes,scrollbars=yes,status=yes"
    );
  };

  return (
    <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
      <h3 className="text-xl font-semibold tracking-tight mb-4">Share Post</h3>

      <div className="flex flex-wrap items-center gap-2 tracking-tight">
        {options.map((data, id) => (
          <button
            key={id}
            onClick={() => openPopup(data.shareUrl)}
            title={`Share to ${data.name}`}
            aria-label={`Share to ${data.name}`}
            className="w-12 h-12 p-2 grid place-content-center text-2xl dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md"
          >
            <data.icon aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
