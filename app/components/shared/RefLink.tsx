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
  return (
    <Link
      href={href + "?ref=yourdomain.com"}
      rel="noopener"
      target={target}
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
}
