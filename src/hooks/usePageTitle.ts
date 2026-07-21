"use client";

import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | YS Cinema`;
    } else {
      document.title = "YS Cinema";
    }
  }, [title]);
}
