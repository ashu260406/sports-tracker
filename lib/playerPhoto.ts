const cache = new Map<string, string | null>();

export async function getPlayerPhoto(
    playerName: string
): Promise<string | null> {
    const key = playerName.trim().toLowerCase();

    if (cache.has(key)) {
        return cache.get(key) ?? null;
    }

    try {
        const searchName = encodeURIComponent(playerName);

        const response = await fetch(
            `https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${searchName}`,
            {
                next: {
                    revalidate: 60 * 60 * 24 * 7,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            const players = data?.player ?? [];

            if (players.length > 0) {
                const player = players[0];

                const photo =
                    player.strCutout ||
                    player.strRender ||
                    player.strThumb ||
                    null;

                if (photo) {
                    cache.set(key, photo);
                    return photo;
                }
            }
        }
    } catch {
        // Try Wikipedia as fallback
    }

    try {
        const title = encodeURIComponent(playerName.replace(/ /g, "_"));

        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=500&titles=${title}`,
            {
                next: {
                    revalidate: 60 * 60 * 24 * 7,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            const pages = data?.query?.pages ?? {};

            const page = Object.values(pages)[0] as any;

            const photo = page?.thumbnail?.source ?? null;

            if (photo) {
                cache.set(key, photo);
                return photo;
            }
        }
    } catch {
        // No photo available
    }

    cache.set(key, null);
    return null;
}