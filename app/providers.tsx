"use client";

import { ThemeProvider } from "next-themes";
import { LayoutGroup } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <LayoutGroup>
        {children}
      </LayoutGroup>
    </ThemeProvider>
  );
}
