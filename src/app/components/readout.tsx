"use client";
import { useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");

  const playAudio = async () => {
    const res = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: "EXAVITQu4vr4xnSDxMaL" })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
      />
      <button onClick={playAudio}>Convert to Speech</button>
    </div>
  );
}