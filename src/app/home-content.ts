import type { FaqItem } from "@/components/faq.types";

export const INFO = {
  name: "Latam Buildathon",
  tagline: "Build in public with LATAM’s fastest builders.",
  subtag:
    "A high-energy buildathon for founders, hackers, and designers across Latin America. Ship something real in days and launch faster.",
  applyUrl: "#apply",
  discordUrl: "http://chat.celo.org/",
  rulesUrl: "#rules",
} as const;

export const NAV_LINKS = [
  { href: "#tracks", label: "Tracks" },
  { href: "#schedule", label: "Timeline" },
  { href: "#rules", label: "Rules" },
  { href: "#submit", label: "Submit" },
  { href: "#resources", label: "Resources" },
  { href: "#prizes", label: "Prizes" },
  { href: "#faq", label: "FAQ" },
] as const;

export type ResourceLanguage = "spanish" | "english" | "portuguese";

export const RESOURCES: Record<
  ResourceLanguage,
  ReadonlyArray<{ title: string; links: ReadonlyArray<{ label: string; url: string }> }>
> = {
  spanish: [
    {
      title: "Celo MX Resources",
      links: [
        {
          label: "Construye tu colección de NFTs con Thirdweb en la red de Celo (Celo Academy)",
          url: "https://www.celo.mx/academy/construye-tu-coleccion-de-nfts-con-thirweb-en-la-red-de-celo-mhw37vrj",
        },
        {
          label: "Construye tu MiniApp en Farcaster (Celo Academy)",
          url: "https://www.celo.mx/academy/construye-tu-miniapp-en-farcaster",
        },
        {
          label: "Reputación On-Chain y Programas de Incentivos (Celo Academy)",
          url: "https://www.celo.mx/academy/reputacion-on-chain-y-programas-de-incentivos",
        },
        {
          label: "Instalación y Configuración de un MCP Server con ComposerKit en Celo (YouTube)",
          url: "https://www.youtube.com/watch?v=96GXwyv6uh4&list=PLacAHCHDWS0oHVH7Toqvgjzi87NVSBEVJ&index=2",
        },
      ],
    },
    {
      title: "Celo Colombia",
      links: [
        {
          label: "Build in Public Playlist (YouTube)",
          url: "https://youtu.be/LLVC6Gg-Czo",
        },
      ],
    },
    {
      title: "CeLatam",
      links: [
        {
          label: "De 0 al Mini App | Tutoriales de Vibecoding",
          url: "https://youtube.com/playlist?list=PLTHLb5LyByJsbq1eMoo-_4ySshi-QAG27",
        },
        {
          label: "Webinars",
          url: "https://youtube.com/playlist?list=PLTHLb5LyByJsBfXgRODRA2InM4-ZGPwKL",
        },
      ],
    },
  ],
  english: [],
  portuguese: [
    {
      title: "CeLatam",
      links: [
        {
          label: "Do 0 ao Mini App | Tutoriais de Vibecoding",
          url: "https://youtube.com/playlist?list=PLTHLb5LyByJswm1jw1YG13dn9piwrk5_t",
        },
      ],
    },
  ],
} as const;

export const TIMELINE = [
  {
    title: "Pre-registrations",
    range: "Dec 17, 2025 → Jan 16, 2026",
    note: "Get early access and prep your idea/team.",
  },
  {
    title: "Buildathon",
    range: "Jan 19 → Feb 27, 2026",
    note: "Registrations remain open until Feb 27.",
  },
  {
    title: "Winners announced",
    range: "Mar 6, 2026",
    note: "Top projects + special awards revealed.",
  },
] as const;

export const TRACKS = [
  { title: "Open Track", description: "Anything goes—build what you're most excited about.", available: true },
  { title: "Farcaster Miniapps", description: "Build a miniapp experience for Farcaster.", available: false },
  { title: "MiniPay Miniapps", description: "Build a MiniPay miniapp focused on real usage.", available: false },
  { title: "Mento", description: "Build using Mento primitives / stable-value experiences.", available: false },
  { title: "Self", description: "Build with Self (identity/attestations—define your angle).", available: false },
] as const;

export type HighlightIconKey = "rocket" | "globe" | "star" | "bolt";

export const HIGHLIGHTS = [
  {
    title: "Ship fast",
    description:
      "Go from idea to deployed demo with practical mentoring, tight scope, and clear milestones.",
    icon: "rocket",
  },
  {
    title: "Build with LATAM",
    description:
      "Meet builders from Mexico to Argentina. Form teams, find cofounders, and learn by doing.",
    icon: "globe",
  },
  {
    title: "Strong feedback",
    description:
      "Get product + engineering feedback from judges and mentors who’ve shipped at scale.",
    icon: "star",
  },
  {
    title: "Momentum & visibility",
    description:
      "Share updates, demos, and wins. The best projects get highlighted to the community.",
    icon: "bolt",
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: HighlightIconKey;
}>;

export const COMMUNITIES = [
  { name: "Celo Mexico", url: "https://celo.mx" },
  { name: "Celo Colombia", url: "https://celocolombia.org" },
  { name: "Celo Brazil", url: null },
  { name: "Celo Argentina", url: null },
  { name: "CeLatam", url: "https://celatam.org" },
] as const;

export const FAQ = [
  {
    question: "Who can participate?",
    answer:
      "Builders from LATAM, living in LATAM—developers, designers, PMs, and founders. You can join solo or with a team (teams must be at least 50% LATAM).",
  },
  {
    question: "Do I need a team?",
    answer:
      "No. You can apply solo and team up during kickoff, or you can bring a team. Solo projects are welcome too.",
  },
  {
    question: "Can I apply to more than one track?",
    answer:
      "Yes — builders can apply to as many tracks as they want. Pick what fits your project (or multiple, if relevant).",
  },
  {
    question: "What do I need to submit?",
    answer:
      "A Karma Gap link to your project. Inside your Karma Gap project profile include: live demo link, GitHub repo link, slides, and a demo video.",
  },
  {
    question: "What are the judging criteria?",
    answer: "Impact, execution quality, clarity of the demo, and craft. Bonus points for shipping end-to-end and telling a great story.",
  },
  {
    question: "How do submissions work?",
    answer:
      "Submit via a form with your Karma Gap project link. Your Karma Gap project should include your GitHub repo, deck, and demo.",
  },
] as const satisfies ReadonlyArray<FaqItem>;

