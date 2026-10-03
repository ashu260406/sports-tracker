"use client";
import { useEffect, useState } from "react";

export default function LocalTime({
    iso,
    options,
}: {
    iso: string;
    options: Intl.DateTimeFormatOptions;
}) {
    const [text, setText] = useState("");

    useEffect(() => {
        setText(new Date(iso).toLocaleString([], options));
    }, [iso, options]);

    return <span suppressHydrationWarning>{text || "\u00A0"}</span>;
}