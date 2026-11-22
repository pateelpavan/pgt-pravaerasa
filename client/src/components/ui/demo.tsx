"use client"

import PrismCometPreloader from "@/components/ui/prism-comet-preloader"

// Paverasa Tech Growth — Warm Orange & Ember light palette
export default function DemoEmber() {
  return (
    <PrismCometPreloader
      loop
      word="Paverasa Tech Growth"
      caption="PTG, a brand of Paverasa Private Limited."
      palette={{
        background: "#080402",
        blue: "#9a3412",
        violet: "#ea580c",
        magenta: "#f97316",
        cyan: "#fdba74",
        gold: "#fed7aa",
      }}
      speed={1.4}
      grid={false}
      durationMs={5200}
    />
  )
}
