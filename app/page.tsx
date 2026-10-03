import { getTodayMatches, type Match } from "@/lib/football";
import LiveScores from "@/components/LiveScores";

export default async function Home() {
  let matches: Match[] = [];
  try {
    matches = (await getTodayMatches()).matches;
  } catch { }

  return (
    <>
      <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pitch-700 via-pitch-800 to-pitch-900 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-volt">Matchday</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
          Today&apos;s <span className="text-volt">Fixtures</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-chalk/70">
          Live scores that refresh automatically. Save your clubs and follow them all season.
        </p>
      </section>
      <LiveScores initial={matches} />
    </>
  );
}