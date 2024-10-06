"use client";

import { useState, useEffect } from "react";
import { AlignCenter, Download, Plus, Volume2 } from "react-feather";

export default function Home() {
    const [data, setData] = useState(null);
    const [tafseer, setTafseer] = useState(null);
    const [showTafseer, setShowTafseer] = useState(false);
    const [isLoadingAya, setIsLoadingAya] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [isLoadingTafseer, setIsLoadingTafseer] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (audio) {
            audio.pause();
        }
        setIsLoadingAya(true);
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
            ] = `https://api.quran.com/api/v4/quran/tafsirs/164?verse_key=${chapter}:${result["aya"]}`;

            setData(result);
            setAudio(null);
            setTafseer(null);
        } catch (error) {
        } finally {
            setShowTafseer(false);
            setIsLoadingAya(false);
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
        setIsLoadingAudio(true);
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
            setIsLoadingAudio(false);
        }
    };

    const downloadAudio = async () => {
        const link = document.createElement('a');
        link.href = data?.['audio-url'] ?? '';
        link.setAttribute('download', 'audio-file.mp3');
        document.body.appendChild(link);
        link.click();
        link.remove();
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
        setIsLoadingTafseer(true);
        try {
            const response = await fetch(data["tafseer-url"]);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            const tafsirs =
                result["tafsirs"]
                    .find(
                        (obj: { resource_id: number }) => obj.resource_id === 16
                    )
                    ["text"].replace(/<[^>]*>/g, "") ?? null;

            setTafseer(tafsirs);
            setShowTafseer(true);
        } catch (error) {
        } finally {
            setIsLoadingTafseer(false);
        }
    };

    return (
        <div className="min-h-[95vh] w-full p-4 max-w-7xl flex flex-col items-center justify-between gap-12 rounded-lg drop-shadow-2xl">
            <div className="flex flex-col items-center justify-start gap-3">
                <h1 className="text-3xl text-[#F0F0F0] font-light text-center leading-relaxed">
                    {!data ? "" : data["surahNameArabicLong"]}
                </h1>
                <h2 className="text-xl text-[#F0F0F0] font-light text-center leading-relaxed">
                    {!data ? "" : data["aya"]}
                </h2>
            </div>
            <div className="h-full w-full flex items-center justify-center">
                {!data ? (
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                    </span>
                ) : (
                    <h1 className="text-2xl text-[#F0F0F0] font-light text-center leading-relaxed">
                        {showTafseer
                            ? tafseer === null
                                ? "Not Found"
                                : tafseer
                            : data["arabic1"][data["aya"] - 1]}
                    </h1>
                )}
            </div>
            <div className="flex items-center justify-center gap-6">
                {isLoadingAya ? (
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#191919]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                        </span>
                    </div>
                ) : (
                    <div
                        onClick={fetchData}
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                    >
                        <Plus className="text-[#191919]" />
                    </div>
                )}
                {isLoadingAudio ? (
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#191919]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                        </span>
                    </div>
                ) : (
                    <div
                        onClick={fetchAndPlayAudio}
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                    >
                        <Volume2 className="text-[#191919]" />
                    </div>
                )}
                {false ? (
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#191919]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                        </span>
                    </div>
                ) : (
                    <div
                        onClick={downloadAudio}
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                    >
                        <Download className="text-[#191919]" />
                    </div>
                )}
                {isLoadingTafseer ? (
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#191919]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
                        </span>
                    </div>
                ) : (
                    <div
                        onClick={fetchTafseer}
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-[#00FFBB]"
                    >
                        <AlignCenter className="text-[#191919]" />
                    </div>
                )}
            </div>
        </div>
    );
}
