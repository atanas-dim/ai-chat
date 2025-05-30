"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Message } from "ai";

function renderMessageContent(message: Message): string {
  // Ignore system/data roles
  if (message.role !== "user" && message.role !== "assistant") {
    return "";
  }

  // Start with any visible text content (e.g., assistant's explanation)
  let baseContent = "";

  if (
    message.content &&
    typeof message.content === "string" &&
    message.content.trim() !== ""
  ) {
    baseContent = message.content.trim();
  }

  // TODO Find correct type or create one
  const toolInvocation = (message as any)?.toolInvocations?.[0];

  if (toolInvocation?.state === "result") {
    switch (toolInvocation.toolName) {
      case "getWeather": {
        const { location, temperatureCelsius, condition } =
          toolInvocation.result;
        return `Weather in ${location}: ${temperatureCelsius}°C, ${condition}`;
      }
      case "solveMath": {
        const mathResult = `Math result: ${toolInvocation.result.result}`;
        return baseContent ? `${baseContent}\n\n${mathResult}` : mathResult;
      }
    }
  }

  return baseContent || "[No content]";
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onError: console.error,
    onFinish: console.log,
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log({ messages });
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 whitespace-prewrap">
      <h1 className="text-2xl font-bold text-center">AI Chat with Tools</h1>
      <div className="bg-gray-100 p-4 rounded-md h-[400px] overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                m.role === "user" ? "bg-blue-200" : "bg-white"
              }`}
            >
              {renderMessageContent(m)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="flex-1 border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
