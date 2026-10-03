"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    return (
        <button
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-chalk/80 transition hover:border-volt hover:text-volt"
            onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/");
                router.refresh();
            }}
        >
            Log out
        </button>
    );
}