"use client";

import { useEffect, useState } from "react";

import { MOTION_MEDIA_QUERY } from "@/lib/motion";

export function useShouldReduceMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(MOTION_MEDIA_QUERY);
    const update = () => setReduced(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}
