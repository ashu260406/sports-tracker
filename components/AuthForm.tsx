"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const res = await fetch(`/api/auth/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
        });
        const data = await res.json();
        if (!res.ok) return setError(data.error);
        router.push("/dashboard");
        router.refresh();
    }

    const input =
        "w-full rounded-lg border border-white/15 bg-pitch-950 px-4 py-3 text-sm outline-none transition placeholder:text-chalk/30 focus:border-volt";

    return (
        <form
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-pitch-800 to-pitch-900 p-8"
        >
            <div className="text-center">
                <div className="text-4xl">⚽</div>
                <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">
                    {mode === "login" ? "Welcome back" : "Join the squad"}
                </h1>
            </div>
            <input name="email" type="email" placeholder="Email" required className={input} />
            <input name="password" type="password" placeholder="Password (min 8)" required className={input} />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button className="rounded-lg bg-volt py-3 font-display text-lg font-extrabold uppercase tracking-wide text-pitch-950 transition hover:brightness-110">
                {mode === "login" ? "Kick off" : "Sign me up"}
            </button>
        </form>
    );
}