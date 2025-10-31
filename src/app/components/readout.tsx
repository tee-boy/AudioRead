"use client";
import { useState, useRef } from "react";
import Header from "./nav";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

export default function ReadOut() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [title] = useState("WHY MUST YOU HUSTLE 🤔🤔");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play / pause
  const handlePlay = async () => {
    const text = localStorage.getItem("extractedText");
    if (!text) return console.error("No extracted text found.");

    // If audio already loaded, just play/pause
    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Generate audio from ElevenLabs
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
      audioRef.current = audio;

      // Track progress
      audio.addEventListener("timeupdate", () => {
        if (audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setDuration(audio.duration);
        }
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });

      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Jump backward
  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  // Jump forward
  const handleForward = () => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f5f5f5]">
      <Header />

      {/* Top Right Buttons */}
      <div className="absolute top-4 right-6 flex space-x-3">
        <button className="border border-gray-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100">
          Change Voice
        </button>
        <button className="border border-gray-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100">
          Sign Up
        </button>
      </div>

      {/* Background hero image */}
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/office-bg.jpg')", // replace with your background image
        }}
      ></div>

      {/* Player Section */}
      <div className="flex flex-col items-center justify-center py-10 px-6">
        <h2 className="text-3xl font-bold mb-6 text-[#2c383d]">{title}</h2>

        {/* Progress bar */}
        <div className="relative w-2/3 max-w-xl mb-6">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const newProgress = Number(e.target.value);
              setProgress(newProgress);
              if (audioRef.current && duration) {
                audioRef.current.currentTime = (newProgress / 100) * duration;
              }
            }}
            className="w-full accent-[#f4894c] cursor-pointer"
          />
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow text-sm font-medium">
            Chapter One
          </div>
        </div>

        {/* Controls */}
      <div className="flex items-center justify-center space-x-8 mt-8">
        {/* Backward Button */}
        <button
          onClick={handleBackward}
          className="w-14 h-14 rounded-full bg-[#2c383d] text-white text-2xl flex items-center justify-center 
                    shadow-lg hover:bg-[#f4894c] hover:text-black transition-all active:scale-95"
        >
          <FaBackward />
        </button>

        {/* Play / Pause Button */}
        <button
          onClick={handlePlay}
          disabled={isLoading}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg font-bold 
            transition-all active:scale-95 
            ${isLoading ? "bg-gray-500" : "bg-[#f4894c] text-black hover:bg-[#ffb070]"}`}
        >
          {isLoading ? (
            <span className="animate-spin text-xl">⏳</span>
          ) : isPlaying ? (
            <FaPause className="text-3xl" />
          ) : (
            <FaPlay className="text-3xl ml-1" />
          )}
        </button>

        {/* Forward Button */}
        <button
          onClick={handleForward}
          className="w-14 h-14 rounded-full bg-[#2c383d] text-white text-2xl flex items-center justify-center 
                    shadow-lg hover:bg-[#f4894c] hover:text-black transition-all active:scale-95"
        >
          <FaForward />
        </button>
      </div>

      </div>
    </div>
  );
}