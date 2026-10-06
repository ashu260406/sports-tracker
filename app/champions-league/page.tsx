/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import {
    getStandings,
    getScorers,
    getCompetitionMatches,
    type Match,
} from "@/lib/football";
import LocalTime from "@/components/LocalTime";
import { getPlayerPhoto } from "@/lib/playerPhoto";
import PlayerAvatar from "@/components/PlayerAvatar";

const DATE_TIME: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
};

function MatchRow({ m, showScore }: { m: Match; showScore: boolean }) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-white/10 bg-pitch-900 p-3 text-sm">
            <Link href={`/teams/${m.homeTeam.id}`} className="flex items-center justify-end gap-2 font-semibold hover:text-volt">
                {m.homeTeam.shortName}
                <img src={m.homeTeam.crest} alt="" className="h-6 w-6 object-contain" />
            </Link>
            <div className="min-w-24 text-center">
                {showScore ? (
                    <div className="rounded-md bg-pitch-950 px-3 py-1 font-display text-xl font-extrabold tabular-nums">
                        {m.score.fullTime.home ?? "-"} : {m.score.fullTime.away ?? "-"}
                    </div>
                ) : (
                    <div className="rounded-md bg-pitch-950 px-2 py-1 text-xs font-semibold text-volt">
                        <LocalTime iso={m.utcDate} options={DATE_TIME} />
                    </div>
                )}
            </div>
            <Link href={`/teams/${m.awayTeam.id}`} className="flex items-center gap-2 font-semibold hover:text-volt">
                <img src={m.awayTeam.crest} alt="" className="h-6 w-6 object-contain" />
                {m.awayTeam.shortName}
            </Link>
        </div>
    );
}

export default async function ChampionsLeague() {
    const [st, sc, up, fin] = await Promise.all([
        getStandings("CL").catch(() => null),
        getScorers("CL").catch(() => null),
        getCompetitionMatches("CL", "SCHEDULED").catch(() => null),
        getCompetitionMatches("CL", "FINISHED").catch(() => null),
    ]);

    const table = st?.standings.find((s) => s.type === "TOTAL")?.table ?? [];
    const upcoming = (up?.matches ?? []).slice(0, 8);
    const results = (fin?.matches ?? []).slice(-8).reverse();
    const scorers = (sc?.scorers ?? []).slice(0, 10);
    const medals = ["🥇", "🥈", "🥉"];

    const photos = await Promise.all(
        scorers.map((s: any) => getPlayerPhoto(s.player.name))
    );

    return (
        <>
            <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1b4d] via-pitch-900 to-pitch-950 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-volt">Europe&apos;s elite</p>
                <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
                    Champions <span className="text-volt">League</span>
                </h1>
                <p className="mt-3 max-w-md text-sm text-chalk/70">
                    League phase table, latest results, upcoming fixtures and top scorers.
                </p>
            </section>

            {/* TABLE */}
            <h2 className="mb-3 font-display text-3xl font-extrabold uppercase">
                League <span className="text-volt">Phase</span>
            </h2>
            {table.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-chalk/60">
                    The table isn&apos;t available yet.
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-pitch-900">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-chalk/50">
                                    <th className="py-3 pl-4">#</th>
                                    <th>Team</th>
                                    <th className="text-center">P</th>
                                    <th className="text-center">W</th>
                                    <th className="text-center">D</th>
                                    <th className="text-center">L</th>
                                    <th className="text-center">GD</th>
                                    <th className="pr-4 text-center">Pts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((r: any) => {
                                    const zone =
                                        r.position <= 8
                                            ? "border-l-green-400"
                                            : r.position <= 24
                                                ? "border-l-amber-400"
                                                : "border-l-red-500";
                                    return (
                                        <tr key={r.team.id} className={`border-b border-l-4 border-white/5 transition hover:bg-white/5 ${zone}`}>
                                            <td className="py-2.5 pl-3 font-display text-lg font-bold">{r.position}</td>
                                            <td>
                                                <Link href={`/teams/${r.team.id}`} className="flex items-center gap-2.5 font-semibold hover:text-volt">
                                                    <img src={r.team.crest} alt="" className="h-6 w-6 object-contain" />
                                                    {r.team.shortName}
                                                </Link>
                                            </td>
                                            <td className="text-center text-chalk/70">{r.playedGames}</td>
                                            <td className="text-center text-chalk/70">{r.won}</td>
                                            <td className="text-center text-chalk/70">{r.draw}</td>
                                            <td className="text-center text-chalk/70">{r.lost}</td>
                                            <td className="text-center text-chalk/70">{r.goalDifference}</td>
                                            <td className="pr-4 text-center font-display text-xl font-extrabold text-volt">{r.points}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 flex flex-wrap gap-4 text-xs text-chalk/50">
                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-400" />Top 8: round of 16</span>
                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />9-24: knockout play-offs</span>
                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />25-36: eliminated</span>
                    </p>
                </>
            )}

            {/* FIXTURES + RESULTS */}
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <div>
                    <h2 className="mb-3 font-display text-3xl font-extrabold uppercase">
                        Upcoming <span className="text-volt">Fixtures</span>
                    </h2>
                    <div className="space-y-2">
                        {upcoming.length === 0 && <p className="text-sm text-chalk/50">No upcoming fixtures.</p>}
                        {upcoming.map((m) => <MatchRow key={m.id} m={m} showScore={false} />)}
                    </div>
                </div>
                <div>
                    <h2 className="mb-3 font-display text-3xl font-extrabold uppercase">
                        Latest <span className="text-volt">Results</span>
                    </h2>
                    <div className="space-y-2">
                        {results.length === 0 && <p className="text-sm text-chalk/50">No results yet.</p>}
                        {results.map((m) => <MatchRow key={m.id} m={m} showScore />)}
                    </div>
                </div>
            </div>

            {/* SCORERS */}
            <h2 className="mb-3 mt-10 font-display text-3xl font-extrabold uppercase">
                Top <span className="text-volt">Scorers</span>
            </h2>
            {scorers.length === 0 && <p className="text-sm text-chalk/50">No goals recorded yet.</p>}
            <div className="grid gap-3 sm:grid-cols-2">
                {scorers.map((s: any, i: number) => (
                    <div key={s.player.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-pitch-900 p-3">
                        <div className="w-8 text-center font-display text-2xl font-bold">
                            {medals[i] ?? <span className="text-chalk/40">{i + 1}</span>}
                        </div>
                        <div className="relative">
                            <PlayerAvatar name={s.player.name} src={photos[i]} />
                            <img
                                src={s.team.crest}
                                alt=""
                                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-pitch-950 object-contain p-0.5"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{s.player.name}</p>
                            <p className="text-xs text-chalk/50">
                                {s.team.shortName}
                                {s.assists != null && ` · ${s.assists} assists`}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-display text-3xl font-extrabold leading-none text-volt">{s.goals}</p>
                            <p className="text-[10px] uppercase tracking-wider text-chalk/50">goals</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}