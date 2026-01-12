import Reveal from "@/components/Reveal";

const cases = [
  {
    title: "Gioia Aperitivo — Audit & stratégie digitale",
    desc: "Analyse de la présence en ligne, personas, segmentation, recommandations de croissance.",
  },
  {
    title: "Éclat Naturel — Marketing responsable (PRIZM / VALS)",
    desc: "Segmentation psychographique, positionnement, plan de communication pour une gamme écoresponsable.",
  },
  {
    title: "Tesla Europe — Gestion de projet événementiel",
    desc: "Planification (Gantt), dépendances, risques, livrables, organisation opérationnelle.",
  },
  {
    title: "Négociation & vente — Argumentaires et objections",
    desc: "Scripts, écoute active, méthode SPIN/CAP, traitement des objections et closing.",
  },
  {
    title: "Droit — Oral et cas pratiques",
    desc: "Argumentation, cadre juridique, raisonnement et mise en situation professionnelle.",
  },
];

export default function EtudesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-14">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Études</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Travaux académiques présentés comme des cas business.
        </p>
      </Reveal>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {cases.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <div className="rounded-3xl bg-[#111113] border border-zinc-800 p-6">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="mt-3 text-zinc-300">{c.desc}</p>
              <p className="mt-4 text-sm text-zinc-400">
                Ajoute ici : capture Canva, slides, schémas, extraits de rapport.
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
