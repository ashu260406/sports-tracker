import Link from "next/link";
import { getUserId } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

const link = "rounded-full px-3 py-1.5 text-sm font-medium text-chalk/70 transition hover:bg-white/10 hover:text-white";

export default async function Navbar() {
    const uid = await getUserId();
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-pitch-950/80 backdrop-blur">
            <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <Link href="/" className="mr-3 flex items-center gap-2">
                        <span className="text-2xl">⚽</span>
                        <span className="font-display text-2xl font-extrabold uppercase tracking-wide">
                            Pitch<span className="text-volt">side</span>
                        </span>
                    </Link>
                    <Link href="/" className={link}>Live</Link>
                    <Link href="/standings" className={link}>Standings</Link>
                    {uid && <Link href="/dashboard" className={link}>My Teams</Link>}
                </div>

                {uid ? (
                    <LogoutButton />
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login" className={link}>Log in</Link>
                        <Link
                            href="/register"
                            className="rounded-full bg-volt px-4 py-1.5 text-sm font-bold text-pitch-950 transition hover:brightness-110"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}