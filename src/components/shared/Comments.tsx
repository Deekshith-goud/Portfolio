"use client";

import { useTheme } from "next-themes";
import Giscus from "@giscus/react";
import { giscusRepoId, giscusCategoryId } from "@/sanity/lib/env.api";

export default function Comments() {
  const theme = useTheme();
  const giscusTheme =
    theme.theme === "light"
      ? "light"
      : theme.theme === "dark"
      ? "transparent_dark"
      : "dark";

  return (
    <Giscus
      id="comments"
      repo={(process.env.NEXT_PUBLIC_GISCUS_REPO as any) || ""}
      repoId={giscusRepoId || ""}
      category="General"
      categoryId={giscusCategoryId || ""}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={giscusTheme}
      lang="en"
      loading="lazy"
    />
  );
}
