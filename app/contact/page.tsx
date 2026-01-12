import Reveal from "@/components/Reveal";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-14">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Pour une opportunité, un projet ou une collaboration, contacte-moi.
        </p>
      </Reveal>

      <div className="mt-10 rounded-3xl bg-[#111113] border border-zinc-800 p-6 md:p-10">
        <Reveal>
          <p className="text-zinc-200">
            Le site est hébergé sur GitHub Pages (statique), donc le plus simple est :
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:tonemail@exemple.com"
              className="rounded-2xl px-5 py-3 bg-white text-black font-medium"
            >
              M’envoyer un email
            </a>
            <a
              href="#"
              className="rounded-2xl px-5 py-3 bg-zinc-900 border border-zinc-700 text-white font-medium"
            >
              LinkedIn
            </a>
            <a
              href="/cv.pdf"
              className="rounded-2xl px-5 py-3 bg-zinc-900 border border-zinc-700 text-white font-medium"
            >
              Télécharger mon CV
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-400">
            Remplace l’email, le lien LinkedIn, et ajoute ton CV en <code className="text-zinc-200">public/cv.pdf</code>.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
