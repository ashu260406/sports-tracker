import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getTeamMatches, type Match } from "@/lib/football";

export default async function Dashboard() {
    const uid = await getUserId();
    if (!uid) redirect("/login");

    const { rows: favs } = await pool.query(
        "SELECT team_id, team_name, crest FROM favorite_teams WHERE user_id=$1",
        [uid]
    );

    if (!favs.length)
        return (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
                <div className="text-4xl">⭐</div>
                <p className="mt-3 font-display text-2xl font-bold uppercase">No saved teams yet</p>
                <p className="mb-5 text-sm text-chalk/60">Pick your clubs from the league table.</p>
                <Link href="/standings" className="rounded-full bg-volt px-5 py-2 text-sm font-bold text-pitch-950">
                    Browse teams
                </Link>
            </div>
        );

    const fixtures = await Promise.all(
        favs.map((f) =>
            getTeamMatches(f.team_id, "SCHEDULED", 3).catch(() => ({ matches: [] as Match[] }))
        )
    );

    return (
        <>
            <h1 className="mb-6 font-display text-5xl font-extrabold uppercase">
                My <span className="text-volt">Teams</span>
            </h1>
            <div className="grid gap-4 sm:grid-cols-2">
                {favs.map((f, i) => (
                    <div key={f.team_id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-pitch-800 to-pitch-900 p-5">
                        <Link href={`/teams/${f.team_id}`} className="flex items-center gap-3 hover:text-volt">
                            <img src={f.crest} alt="" className="h-12 w-12 object-contain" />
                            <span className="font-display text-2xl font-bold uppercase">{f.team_name}</span>
                        </Link>
                        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-volt">Next up</p>
                        <ul className="space-y-1.5 text-sm">
                            {fixtures[i].matches.map((m) => (
                                <li key={m.id} suppressHydrationWarning className="flex justify-between rounded-lg bg-pitch-950/60 px-3 py-2">
                                    <span>{m.homeTeam.shortName} vs {m.awayTeam.shortName}</span>
                                    <span className="text-chalk/50">
                                        {new Date(m.utcDate).toLocaleDateString([], { day: "numeric", month: "short" })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}