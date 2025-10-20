import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: body.text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  // handle potential JSON error responses
  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(error, { status: response.status });
  }

  const audioBlob = await response.arrayBuffer();
  return new NextResponse(audioBlob, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
