import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Roman Layani — Portfolio",
  description: "Portfolio business, startups, projets académiques.",
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-300 hover:text-white transition"
    >
      {label}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <header className="sticky top-0 z-50 backdrop-blur border-b border-zinc-800/60 bg-black/30">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              Roman Layani
            </Link>
            <nav className="flex items-center gap-5">
              <NavLink href="/projets" label="Projets" />
              <NavLink href="/etudes" label="Études" />
              <NavLink href="/galerie" label="Galerie" />
              <NavLink href="/contact" label="Contact" />
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-zinc-800/60 mt-20">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-400">
            © {new Date().getFullYear()} Roman Layani — Portfolio
          </div>
        </footer>
      </body>
    </html>
  );
}
