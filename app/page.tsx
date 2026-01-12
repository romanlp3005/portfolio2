import Link from "next/link";
import Reveal from "@/components/Reveal";
import OverlapSection from "@/components/OverlapSection";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* HERO */}
      <section className="pt-16 pb-20">
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Roman Layani
          </h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-300 max-w-2xl">
            Entrepreneur. Étudiant en business. Je construis des projets à la
            croisée du produit, du marketing et du digital.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projets"
              className="rounded-2xl px-5 py-3 bg-white text-black font-medium"
            >
              Voir mes projets
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl px-5 py-3 bg-zinc-900 border border-zinc-700 text-white font-medium"
            >
              Me contacter
            </Link>
          </div>
        </Reveal>
      </section>

      {/* PROJETS (Overlap) */}
      <OverlapSection className="pb-14">
        <div className="rounded-3xl bg-[#111113] border border-zinc-800 p-6 md:p-10">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Projets</h2>
            <p className="mt-2 text-zinc-300 max-w-2xl">
              Startups & produits : Digitag Memory, Digitag Pro, Chroma.
            </p>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Digitag Memory",
                desc: "Plaques commémoratives connectées NFC + QR, expérience mémorielle premium.",
              },
              {
                title: "Digitag Pro",
                desc: "Systèmes QR/NFC pour entreprises : feedback, stats, automatisations.",
              },
              {
                title: "Chroma",
                desc: "Marque thermochromique : innovation textile, identité luxe/futuriste.",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="rounded-2xl bg-black/40 border border-zinc-800 p-5 hover:border-zinc-600 transition">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </OverlapSection>

      {/* ÉTUDES (Overlap) */}
      <OverlapSection className="pb-20" lift={180}>
        <div className="rounded-3xl bg-[#0E0E10] border border-zinc-800 p-6 md:p-10">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Études & cas business
            </h2>
            <p className="mt-2 text-zinc-300 max-w-2xl">
              BUT TC : stratégie marketing, digital, gestion de projet,
              négociation, droit.
            </p>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              "Gioia Aperitivo — Audit & stratégie digitale",
              "Éclat Naturel — Segmentation PRIZM/VALS & plan de com",
              "Tesla Europe — Gantt & analyse des risques événement",
              "Négociation — scripts, objections, méthode SPIN/CAP",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="rounded-2xl bg-black/35 border border-zinc-800 p-5">
                  <p className="text-zinc-200">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/etudes" className="text-zinc-300 hover:text-white">
              Voir tous les cas académiques →
            </Link>
          </div>
        </div>
      </OverlapSection>
    </main>
  );
}
