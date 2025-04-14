"use client";

import { useOnNavigate } from "@/hooks/use-on-navigate";
import React, { Suspense } from "react";

export default function TopLoadingIndicator() {
  const loading = useOnNavigate();

  return (
    <Suspense>
      <div
        aria-busy={loading}
        className={`fixed top-0 left-0 right-0 h-2 bg-primary/70 overflow-hidden ${
          loading ? "block" : "hidden"
        }`}
      >
        <div className="h-full bg-primary/90 animate-[indeterminate_1.5s_infinite_linear]" />
      </div>
    </Suspense>
  );
}
