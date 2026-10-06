/* eslint-disable @typescript-eslint/no-explicit-any */
const UA = "PitchsideApp/1.0 (salimathashu26@gmail.com)"; // put your real email

async function summary(title: string) {
    const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title.replace(/ /g, "_")
        )}`,
        { headers: { "User-Agent": UA }, next: { revalidate: 60 * 60 * 24 * 7 } }
    );
    if (!res.ok) return null;
    return res.json();
}

const isFootballer = (d: any) =>
    /footballer|soccer|football/i.test(d?.description ?? "");

export async function getPlayerPhoto(name: string): Promise<string | null> {
    try {
        // try the plain name first, then the "(footballer)" disambiguated page
        for (const title of [name, `${name} (footballer)`]) {
            const d = await summary(title);
            if (d && d.type !== "disambiguation" && isFootballer(d) && d.thumbnail?.source)
                return d.thumbnail.source as string;
        }
        return null;
    } catch {
        return null;
    }
}