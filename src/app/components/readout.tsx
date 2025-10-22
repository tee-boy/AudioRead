"use client";
import { useState } from "react";

export default function ReadOut() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    const text = localStorage.getItem("extractedText");
    if (!text) {
      console.error("No extracted text found.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "EXAVITQu4vr4xnSDxMaL" }),
      });

      if (!res.ok) throw new Error("Speech generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      await audio.play(); // now allowed since user clicked button ✅
      setIsPlaying(true);
      localStorage.removeItem("extractedText"); // optional cleanup
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1c1c1c] text-white">
      <h1 className="text-2xl font-semibold mb-4">🔊 Ready to Read</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Click below to listen to the extracted content from your uploaded file.
      </p>

      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="px-6 py-3 bg-[#f4894c] text-black rounded-lg font-bold hover:bg-[#ffb070] transition active:scale-95"
      >
        {isLoading ? "Converting..." : isPlaying ? "Playing..." : "▶️ Start Reading"}
      </button>
    </div>
  );
}