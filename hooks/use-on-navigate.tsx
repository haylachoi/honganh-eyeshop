"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SWMessage = {
  fetchUrl: string;
  dest: string;
};

let clickTimestamp = 0;
let clickedUrl: string | null = null;

export function useOnNavigate(): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Kết hợp pathname + searchParams để tạo URL hiện tại
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    // Nếu URL hiện tại khác URL khi click thì coi như navigate xong
    clickTimestamp = 0;
    if (clickedUrl && currentUrl !== clickedUrl) {
      setLoading(false);
      clickedUrl = null;
    }
  }, [currentUrl]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;

    const onMessage = (event: MessageEvent<SWMessage>) => {
      if (Date.now() - clickTimestamp > 1000) return;

      const { fetchUrl, dest } = event.data;
      const url = safeToURL(fetchUrl);

      if (url?.search.includes("_rsc=") && dest === "") {
        setLoading(true);
        clickTimestamp = 0;
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement | null;

      if (anchor && anchor.href) {
        clickTimestamp = Date.now();
        clickedUrl = anchor.href;
      }
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    window.addEventListener("click", onClick, true);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  return loading;
}

function safeToURL(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
