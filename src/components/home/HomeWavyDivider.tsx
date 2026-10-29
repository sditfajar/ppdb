import React from "react";

interface HomeWavyDividerProps {
  className?: string;
  fillColor?: string; // Tailwind color class or hex
  inverted?: boolean;
}

export function HomeWavyDivider({
  className = "",
  fillColor = "text-[#F2F3FF]",
  inverted = false,
}: HomeWavyDividerProps) {
  if (inverted) {
    return (
      <div
        className={`w-full ${fillColor} fill-current leading-none rotate-180 -mt-1 pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <svg
          className="w-full h-10 lg:h-14 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 64"
        >
          <path
            d="M0,0 C360,50 640,0 1000,50 C1280,30 1380,10 1440,30 L1440,64 L0,64 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${fillColor} fill-current leading-none -mb-1 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-12 lg:h-16 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 64"
      >
        <path
          d="M0,0 C320,64 420,10 720,40 C1020,70 1140,20 1440,50 L1440,64 L0,64 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

