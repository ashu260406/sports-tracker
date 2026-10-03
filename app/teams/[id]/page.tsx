/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTeam, getTeamMatches } from "@/lib/football";
import { getUserId } from "@/lib/auth";
import { pool } from "@/lib/db";
import FavoriteButton from "@/components/FavoriteButton";

export default async function TeamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [team, upcoming] = await Promise.all([getTeam(id), getTeamMatches(id)]);

    const uid = await getUserId();
    let isFav = false;
    if (uid) {
        const { rowCount } = await pool.query(
            "SELECT 1 FROM favorite_teams WHERE user_id=$1 AND team_id=$2",
            [uid, id]
        );
        isFav = !!rowCount;
    }

    return (
        <>
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pitch-700 via-pitch-800 to-pitch-900 p-6 sm:p-8">
                <img
                    src={team.crest}
                    alt=""
                    className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 object-contain opacity-10"
                />
                <div className="relative flex flex-wrap items-center gap-5">
                    <img src={team.crest} alt="" className="h-24 w-24 object-contain drop-shadow-lg" />
                    <div className="min-w-0 flex-1">
                        <h1 className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
                            {team.name}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {team.venue && <span className="rounded-full bg-black/30 px-3 py-1">🏟️ {team.venue}</span>}
                            {team.founded && <span className="rounded-full bg-black/30 px-3 py-1">📅 Founded {team.founded}</span>}
                            {team.area?.name && <span className="rounded-full bg-black/30 px-3 py-1">🌍 {team.area.name}</span>}
                        </div>
                    </div>
                    <FavoriteButton
                        teamId={team.id}
                        name={team.shortName ?? team.name}
                        crest={team.crest}
                        initiallyFav={isFav}
                        loggedIn={!!uid}
                    />
                </div>
            </section>

            <h2 className="mb-3 mt-10 font-display text-3xl font-extrabold uppercase">
                Upcoming <span className="text-volt">Fixtures</span>
            </h2>
            <div className="space-y-2">
                {upcoming.matches.length === 0 && <p className="text-sm text-chalk/50">No upcoming fixtures.</p>}
                {upcoming.matches.map((m) => (
                    <div
                        key={m.id}
                        suppressHydrationWarning
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-pitch-900 p-3 text-sm"
                    >
                        <span className="w-24 shrink-0 rounded-md bg-pitch-950 px-2 py-1 text-center text-xs font-semibold text-volt">
                            {new Date(m.utcDate).toLocaleDateString([], { day: "numeric", month: "short" })}
                        </span>
                        <span className="flex flex-1 items-center justify-end gap-2 font-semibold">
                            {m.homeTeam.shortName}
                            <img src={m.homeTeam.crest} alt="" className="h-6 w-6 object-contain" />
                        </span>
                        <span className="text-xs text-chalk/40">vs</span>
                        <span className="flex flex-1 items-center gap-2 font-semibold">
                            <img src={m.awayTeam.crest} alt="" className="h-6 w-6 object-contain" />
                            {m.awayTeam.shortName}
                        </span>
                    </div>
                ))}
            </div>

            <h2 className="mb-3 mt-10 font-display text-3xl font-extrabold uppercase">
                The <span className="text-volt">Squad</span>
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
                {team.squad?.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-pitch-900 px-3 py-2 text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span className="rounded-full bg-pitch-700 px-2 py-0.5 text-[11px] text-chalk/80">
                            {p.position ?? "—"}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}