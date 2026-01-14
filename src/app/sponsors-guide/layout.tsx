import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors Guide - Human.tech × Celo LATAM Buildathon",
  description:
    "Operational, financial, and coordination guidelines for the Human.tech $1,000 USD sponsorship of the Celo LATAM Buildathon.",
};

export default function SponsorshipGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
