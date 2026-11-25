import { createFileRoute } from "@tanstack/react-router";
import { SkillBridgeApp } from "@/components/skillbridge/SkillBridgeApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Closing the Local Experience Gap" },
      { name: "description", content: "Blind, skills-first matching and paid micro-fellowships that give refugee talent in Kenya a Verified Local Reference." },
      { property: "og:title", content: "SkillBridge — Closing the Local Experience Gap" },
      { property: "og:description", content: "Blind talent discovery, micro-fellowships and verified local references for refugee professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillBridgeApp,
});
