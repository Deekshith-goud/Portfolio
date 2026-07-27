"use client";

import { ThemeProvider } from "next-themes";
import { LayoutGroup, LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <LazyMotion features={domAnimation}>
        <LayoutGroup>
          {children}
        </LayoutGroup>
      </LazyMotion>
    </ThemeProvider>
  );
}
