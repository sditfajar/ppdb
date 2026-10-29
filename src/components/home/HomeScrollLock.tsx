"use client";

import { useEffect } from "react";

export function HomeScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("home-scroll-locked");
    body.classList.add("home-scroll-locked");

    return () => {
      html.classList.remove("home-scroll-locked");
      body.classList.remove("home-scroll-locked");
    };
  }, []);

  return null;
}
