import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { HTMLAttributeAnchorTarget } from "react";

export default function RefLink({
  href,
  children,
  className,
  target = "_blank",
  title,
}: {
  href: Url;
  children?: React.ReactNode;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
  title?: string;
}) {
  let finalHref = href;
  if (typeof href === "string" && href.startsWith("http")) {
    try {
      const url = new URL(href);
      const domain = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : "deekshith-goud.vercel.app";
      url.searchParams.set("ref", domain);
      finalHref = url.toString();
    } catch (e) {
      // Ignored
    }
  }

  return (
    <Link
      href={finalHref}
      rel="noopener"
      target={target}
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
}
