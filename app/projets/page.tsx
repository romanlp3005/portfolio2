import Reveal from "@/components/Reveal";

const projects = [
  {
    title: "Digitag Memory",
    tagline: "Plaques commémoratives connectées.",
    desc: "Produit premium intégrant NFC + QR avec une page mémorielle (photos, souvenirs, messages).",
    bullets: [
      "Design produit & packaging premium",
      "Expérience UX de la page mémorielle",
      "Système de QR dynamiques / stats",
    ],
  },
  {
    title: "Digitag Pro",
    tagline: "QR/NFC pour entreprises.",
    desc: "Solution B2B pour centraliser avis, feedback, redirections et statistiques via QR/NFC.",
    bullets: [
      "Proposition de valeur B2B",
      "Automatisations & logique dashboard",
      "Système scalable (QR dynamiques)",
    ],
  },
  {
    title: "Chroma",
    tagline: "Vêtements thermochromiques premium.",
    desc: "Marque fashion innovante : tissus thermochromiques, identité luxe/futuriste, produit sur-mesure.",
    bullets: [
      "Branding & direction artistique",
      "Développement concept produit",
      "Stratégie marketing & positionnement",
    ],
  },
];

export default function ProjetsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-14">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Projets</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Mes projets entrepreneuriaux : produit, branding, marketing, digital.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="rounded-3xl bg-[#111113] border border-zinc-800 p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">{p.title}</h2>
                  <p className="mt-2 text-zinc-300">{p.tagline}</p>
                </div>
              </div>

              <p className="mt-5 text-zinc-200 max-w-3xl">{p.desc}</p>

              <ul className="mt-6 grid md:grid-cols-3 gap-3">
                {p.bullets.map((b) => (
                  <li key={b} className="rounded-2xl bg-black/35 border border-zinc-800 p-4 text-zinc-200">
                    {b}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-zinc-400">
                Ajoute ici tes images : mockups, packaging, captures UI, photos réelles.
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
