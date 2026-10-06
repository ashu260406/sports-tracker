export default function PlayerAvatar({
    name,
    src,
}: {
    name: string;
    src: string | null;
}) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return src ? (
        <img
            src={src}
            alt={name}
            className="h-12 w-12 rounded-full border-2 border-volt/40 object-cover object-top"
        />
    ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/10 bg-pitch-700 font-display text-lg font-bold text-chalk/70">
            {initials}
        </div>
    );
}