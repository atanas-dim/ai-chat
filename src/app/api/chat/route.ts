import { streamText } from "ai";
import { getWeather } from "@/tools/getWeather";
import { solveMath } from "@/tools/solveMath";
import { openai } from "@ai-sdk/openai";
// import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    messages,
    tools: {
      getWeather,
      solveMath,
    },
  });

  console.log({ result });

  return result.toDataStreamResponse();
}
