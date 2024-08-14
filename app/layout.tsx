import type { Metadata } from "next";
import "@/app/globals.css";
import "tailwindcss/tailwind.css";

export const metadata: Metadata = {
    title: "Ayat",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-[#191919] m-0 p-0">
            <head>
                <link rel="icon" href="/infinite-toolkit/favicon.svg" />
            </head>
            <body className="flex justify-center items-center">{children}</body>
        </html>
    );
}
