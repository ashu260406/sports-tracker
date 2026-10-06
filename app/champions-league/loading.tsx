export default function Loading() {
    return (
        <div>
            <div className="skeleton mb-8 h-40 w-full rounded-2xl" />
            <div className="rounded-2xl border border-white/10 bg-pitch-900 p-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-white/5 py-3">
                        <div className="skeleton h-5 w-5" />
                        <div className="skeleton h-6 w-6 rounded-full" />
                        <div className="skeleton h-4 flex-1" />
                        <div className="skeleton h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}