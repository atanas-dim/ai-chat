import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get current weather for a given location.",
  parameters: z.object({
    location: z
      .string()
      .describe("City or location name to get the weather for"),
  }),
  async execute({ location }) {
    return {
      location,
      temperatureCelsius: 24,
      condition: "Sunny",
    };
  },
});
