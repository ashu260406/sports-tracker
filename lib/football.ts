/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = "https://api.football-data.org/v4";

async function api<T>(path: string, revalidate = 60): Promise<T> {
    const res = await fetch(BASE + path, {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY! },
        next: { revalidate },
    });
    if (!res.ok) throw new Error(`Football API error ${res.status}`);
    return res.json();
}

export type Team = { id: number; name: string; shortName: string; crest: string };
export type Match = {
    id: number;
    utcDate: string;
    status: string;
    competition: { name: string; code: string };
    homeTeam: Team;
    awayTeam: Team;
    score: { fullTime: { home: number | null; away: number | null } };
};

export const getTodayMatches = () => api<{ matches: Match[] }>("/matches", 30);

export const getStandings = (code = "PL") =>
    api<{ standings: { type: string; table: any[] }[] }>(
        `/competitions/${code}/standings`,
        300
    );

export const getScorers = (code = "PL") =>
    api<{ scorers: any[] }>(`/competitions/${code}/scorers`, 600);

export const getTeam = (id: number | string) => api<any>(`/teams/${id}`, 600);

export const getTeamMatches = (id: number | string, status = "SCHEDULED", limit = 5) =>
    api<{ matches: Match[] }>(
        `/teams/${id}/matches?status=${status}&limit=${limit}`,
        120
    );