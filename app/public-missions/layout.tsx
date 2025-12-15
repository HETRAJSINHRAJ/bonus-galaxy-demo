import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galactic Missions - Bonus Galaxy",
  description: "Complete missions and collect Nequada for the crew of Nebukadneza",
};

// Completely standalone layout without any authentication
export default function PublicMissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}