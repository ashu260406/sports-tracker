import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export async function POST(req: Request) {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success)
        return NextResponse.json(
            { error: "Invalid email or password (min 8 chars)" },
            { status: 400 }
        );

    const { email, password } = parsed.data;
    const hash = await bcrypt.hash(password, 10);

    try {
        const { rows } = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
            [email.toLowerCase(), hash]
        );
        await createSession(rows[0].id);
        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as { code?: string }).code === "23505")
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}