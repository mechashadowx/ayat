"use client";

import { useState, useEffect } from "react";
import { AlignCenter, Plus, Volume2 } from "react-feather";

export default function Home() {
    const [data, setData] = useState(null);
    const [tafseer, setTafseer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showTafseer, setShowTafseer] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (audio) {
            audio.pause();
        }
        setShowTafseer(false);
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

            result["aya"] = Math.floor(Math.random() * result["totalAyah"]) + 1;
            result[
                "audio-url"
            ] = `https://quranaudio.pages.dev/2/${chapter}_${result["aya"]}.mp3`;
            result[
                "tafseer-url"
            ] = `http://api.quran-tafseer.com/tafseer/1/${chapter}/${result["aya"]}`;

            setData(result);
            setAudio(null);
            setTafseer(null);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAndPlayAudio = async () => {
        setShowTafseer(false);
        if (!data) {
            return;
        }
        if (audio) {
            audio.play();
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(data["audio-url"]);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioObject = new Audio(audioUrl);
            setAudio(audioObject);
            audioObject.play();
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTafseer = async () => {
        if (!data) {
            return;
        }
        if (showTafseer) {
            setShowTafseer(false);
            return;
        }
        if (tafseer) {
            setShowTafseer(true);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(data["tafseer-url"]);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setTafseer(result);
            setShowTafseer(true);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[90%] w-full p-4 max-w-7xl flex flex-col items-center justify-between rounded-lg drop-shadow-2xl">
            <h1 className="text-3xl text-[#F0F0F0] font-light text-center leading-relaxed">
                {isLoading || !data ? "" : data["surahNameArabicLong"]}
            </h1>
            <h2 className="text-xl text-[#F0F0F0] font-light text-center leading-relaxed">
                {isLoading || !data ? "" : data["aya"]}
            </h2>
            <div className="h-full w-full flex items-center justify-center">
                {isLoading || !data ? (
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                    </span>
                ) : (
                    <h1 className="text-2xl text-[#F0F0F0] font-light text-center leading-relaxed">
                        {showTafseer
                            ? tafseer === null
                                ? "Not Found"
                                : tafseer["text"]
                            : data["arabic1"][data["aya"] - 1]}
                    </h1>
                )}
            </div>
            <div className="flex items-center justify-center gap-3">
                <div
                    onClick={fetchData}
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                >
                    <Plus className="text-[#191919]" />
                </div>
                <div
                    onClick={fetchAndPlayAudio}
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                >
                    <Volume2 className="text-[#191919]" />
                </div>
                <div
                    onClick={fetchTafseer}
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                >
                    <AlignCenter className="text-[#191919]" />
                </div>
            </div>
        </div>
    );
}
