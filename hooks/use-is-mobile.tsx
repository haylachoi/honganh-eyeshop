"use client";

import { useEffect, useState } from "react";

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640)
        setBreakpoint("mobile"); // Tailwind sm
      else if (width < 1024)
        setBreakpoint("tablet"); // Tailwind md/lg
      else setBreakpoint("desktop"); // Tailwind lg+
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};
