"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton(props: {
    teamId: number;
    name: string;
    crest: string;
    initiallyFav: boolean;
    loggedIn: boolean;
}) {
    const [fav, setFav] = useState(props.initiallyFav);
    const router = useRouter();

    async function toggle() {
        if (!props.loggedIn) return router.push("/login");
        const res = await fetch("/api/favorites", {
            method: fav ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId: props.teamId, name: props.name, crest: props.crest }),
        });
        if (res.ok) {
            setFav(!fav);
            router.refresh();
        }
    }

    return (
        <button
            onClick={toggle}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${fav
                    ? "bg-volt text-pitch-950 hover:brightness-110"
                    : "border border-white/30 text-white hover:border-volt hover:text-volt"
                }`}
        >
            {fav ? "★ Saved" : "☆ Save team"}
        </button>
    );
}