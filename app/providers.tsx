"use client";

import { ThemeProvider } from "next-themes";
import { LayoutGroup, LazyMotion, domMax } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <LazyMotion strict features={domMax}>
        <LayoutGroup>
          {children}
        </LayoutGroup>
      </LazyMotion>
    </ThemeProvider>
  );
}
