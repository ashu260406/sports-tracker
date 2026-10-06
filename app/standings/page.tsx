/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getStandings, getScorers } from "@/lib/football";
import { getPlayerPhoto } from "@/lib/playerPhoto";
import PlayerAvatar from "@/components/PlayerAvatar";

const LEAGUES: Record<string, string> = {
    PL: "Premier League",
    PD: "La Liga",
    BL1: "Bundesliga",
    SA: "Serie A",
    FL1: "Ligue 1",
};

export default async function Standings({
    searchParams,
}: {
    searchParams: Promise<{ league?: string }>;
}) {
    const { league = "PL" } = await searchParams;
    const [st, sc] = await Promise.all([getStandings(league), getScorers(league)]);
    const table = st.standings.find((s) => s.type === "TOTAL")?.table ?? [];
    const medals = ["🥇", "🥈", "🥉"];

    const photos = await Promise.all(
        sc.scorers.map((s: any) => getPlayerPhoto(s.player.name))
    );

    return (
        <>
            <h1 className="mb-4 font-display text-5xl font-extrabold uppercase">
                League <span className="text-volt">Table</span>
            </h1>

            <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(LEAGUES).map(([code, name]) => (
                    <Link
                        key={code}
                        href={`/standings?league=${code}`}
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${code === league
                            ? "border-volt bg-volt text-pitch-950"
                            : "border-white/15 text-chalk/70 hover:border-white/40"
                            }`}
                    >
                        {name}
                    </Link>
                ))}
            </div>

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
                                r.position <= 4
                                    ? "border-l-green-400"
                                    : r.position > table.length - 3
                                        ? "border-l-red-500"
                                        : "border-l-transparent";
                            return (
                                <tr
                                    key={r.team.id}
                                    className={`border-b border-l-4 border-white/5 transition hover:bg-white/5 ${zone}`}
                                >
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
            <p className="mt-2 flex gap-4 text-xs text-chalk/50">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-400" />Top 4</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />Relegation zone</span>
            </p>

            <h2 className="mb-3 mt-10 font-display text-3xl font-extrabold uppercase">
                Top <span className="text-volt">Scorers</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {sc.scorers.map((s: any, i: number) => (
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