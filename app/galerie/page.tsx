import Reveal from "@/components/Reveal";

const placeholders = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  label: `Visuel ${i + 1}`,
}));

export default function GaleriePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-14">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Galerie</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Mockups, packaging, photos, captures d’écran, affiches, documents.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {placeholders.map((x, i) => (
          <Reveal key={x.id} delay={i * 0.03}>
            <div className="aspect-square rounded-3xl bg-black/35 border border-zinc-800 hover:border-zinc-600 transition p-4 flex items-end">
              <span className="text-sm text-zinc-300">{x.label}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-sm text-zinc-400">
        Pour ajouter tes images : mets-les dans <code className="text-zinc-200">public/images</code> et remplace les blocs par des &lt;img /&gt;.
      </p>
    </main>
  );
}
