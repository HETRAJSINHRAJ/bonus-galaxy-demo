import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galactic Missions - Bonus Galaxy",
  description: "Complete missions and collect Nequada for the crew of Nebukadneza",
};

export default function MissionsExternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}