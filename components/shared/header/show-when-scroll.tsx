"use client";

import { useEffect, useRef, useState } from "react";
import TopHeader from "./top-header";

export const ShowWhenScroll = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const visibleRef = useRef(true); // lưu giá trị hiện tại

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrollingUp = currentScroll < lastScrollTop.current;
      lastScrollTop.current = currentScroll;

      const shouldBeVisible = isScrollingUp || currentScroll <= 10;

      // Chỉ update state khi giá trị thay đổi
      if (shouldBeVisible !== visibleRef.current) {
        visibleRef.current = shouldBeVisible;
        setIsVisible(shouldBeVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TopHeader
        className={`fixed top-0 left-0 w-full z-[1000] transition-transform duration-300 ease-in-out will-change-transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      />
      <div className="h-[48px]" />
    </>
  );
};
