import "./globals.css";

export const metadata = {
  title: "Roman Layani-Pujol — Portfolio",
  description: "Portfolio business, startups, projets académiques.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#0B0B0D] text-white">
        {children}
      </body>
    </html>
  );
}
