"use client";

import { useState, useEffect } from "react";
import { Plus, Volume2 } from "react-feather";

export default function Home() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const chapter = Math.floor(Math.random() * 114) + 1;
            const response = await fetch(
                `https://quranapi.pages.dev/api/${chapter}.json`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full p-4 max-w-7xl flex flex-col items-center justify-between rounded-lg drop-shadow-2xl">
            <div className="h-full w-full flex items-center justify-center">
                {isLoading || !data ? (
                    <span className="animate-ping rounded-full bg-sky-400 opacity-75"></span>
                ) : (
                    <h1 className="text-2xl text-[#F0F0F0] font-light text-center leading-relaxed">
                        {
                            data["arabic1"][
                                Math.floor(Math.random() * data["totalAyah"])
                            ]
                        }
                    </h1>
                )}
            </div>
            <div
                onClick={fetchData}
                className="flex items-center justify-center gap-3"
            >
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]">
                    <Plus className="text-[#191919]" />
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]">
                    <Volume2 className="text-[#191919]" />
                </div>
            </div>
        </div>
    );
}
