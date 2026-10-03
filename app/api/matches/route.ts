import { NextResponse } from "next/server";
import { getTodayMatches } from "@/lib/football";

export async function GET() {
    try {
        return NextResponse.json(await getTodayMatches());
    } catch {
        return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
}