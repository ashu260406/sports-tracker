import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserId } from "@/lib/auth";

export async function GET() {
    const uid = await getUserId();
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { rows } = await pool.query(
        "SELECT team_id, team_name, crest FROM favorite_teams WHERE user_id = $1",
        [uid]
    );
    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    const uid = await getUserId();
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { teamId, name, crest } = await req.json();
    await pool.query(
        `INSERT INTO favorite_teams (user_id, team_id, team_name, crest)
     VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [uid, teamId, name, crest]
    );
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const uid = await getUserId();
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { teamId } = await req.json();
    await pool.query(
        "DELETE FROM favorite_teams WHERE user_id = $1 AND team_id = $2",
        [uid, teamId]
    );
    return NextResponse.json({ ok: true });
}