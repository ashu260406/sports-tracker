"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Match } from "@/lib/football";
import LocalTime from "./LocalTime";


const isLive = (s: string) => s === "IN_PLAY" || s === "PAUSED";
const KICKOFF: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
};

function TeamCell({ team, align }: { team: Match["homeTeam"]; align: "left" | "right" }) {
    return (
        <Link
            href={`/teams/${team.id}`}
            className={`flex items-center gap-3 transition hover:text-volt ${align === "right" ? "flex-row-reverse text-right" : ""
                }`}
        >
            <img src={team.crest} alt="" className="h-9 w-9 object-contain" />
            <span className="font-semibold">{team.shortName}</span>
        </Link>
    );
}

export default function LiveScores({ initial }: { initial: Match[] }) {
    const [matches, setMatches] = useState(initial);
    const [updated, setUpdated] = useState<Date | null>(null);

    useEffect(() => {
        setUpdated(new Date());
        const tick = async () => {
            try {
                const res = await fetch("/api/matches");
                if (!res.ok) return;
                const data = await res.json();
                setMatches(data.matches);
                setUpdated(new Date());
            } catch { }
        };
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);

    if (!matches.length)
        return (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
                <div className="text-4xl">🏟️</div>
                <p className="mt-3 font-display text-2xl font-bold uppercase">No matches today</p>
                <p className="text-sm text-chalk/60">Check the standings while you wait for kick-off.</p>
            </div>
        );

    const groups = matches.reduce<Record<string, Match[]>>((acc, m) => {
        (acc[m.competition.name] ??= []).push(m);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <p className="flex items-center gap-2 text-xs text-chalk/50">
                <span className="live-dot" />
                Auto-refreshing every 30s{updated && ` · last update ${updated.toLocaleTimeString()}`}
            </p>

            {Object.entries(groups).map(([league, list]) => (
                <section key={league}>
                    <h2 className="mb-3 border-l-4 border-volt pl-3 font-display text-xl font-bold uppercase tracking-wide">
                        {league}
                    </h2>
                    <div className="space-y-3">
                        {list.map((m) => {
                            const live = isLive(m.status);
                            return (
                                <div
                                    key={m.id}
                                    className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border p-4 transition hover:-translate-y-0.5 ${live
                                        ? "border-red-500/40 bg-pitch-800 shadow-[0_0_30px_-10px_rgba(255,59,59,0.6)]"
                                        : "border-white/10 bg-pitch-900 hover:border-white/25"
                                        }`}
                                >
                                    <TeamCell team={m.homeTeam} align="left" />

                                    <div className="text-center">
                                        <div
                                            className={`rounded-lg px-4 py-1 font-display text-3xl font-extrabold tabular-nums ${live ? "bg-pitch-950 text-volt" : "bg-pitch-950"
                                                }`}
                                        >
                                            {m.score.fullTime.home ?? "-"} : {m.score.fullTime.away ?? "-"}
                                        </div>
                                        <div
                                            suppressHydrationWarning
                                            className="mt-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                                        >
                                            {live ? (
                                                <>
                                                    <span className="live-dot" />
                                                    <span className="text-red-400">Live</span>
                                                </>
                                            ) : m.status === "FINISHED" ? (
                                                <span className="text-chalk/50">Full time</span>
                                            ) : (
                                                <span className="text-chalk/60">
                                                    <LocalTime iso={m.utcDate} options={KICKOFF} />
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <TeamCell team={m.awayTeam} align="right" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}