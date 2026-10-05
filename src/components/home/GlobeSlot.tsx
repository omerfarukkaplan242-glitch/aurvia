"use client";

import dynamic from "next/dynamic";

const JourneyGlobe = dynamic(() => import("./JourneyGlobe").then((mod) => mod.JourneyGlobe), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-full border border-white/10" aria-hidden="true" />,
});

export function GlobeSlot() {
  return <JourneyGlobe />;
}
