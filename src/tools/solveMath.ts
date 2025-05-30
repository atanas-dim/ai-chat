import { tool } from "ai";
import { evaluate } from "mathjs";
import { z } from "zod";

export const solveMath = tool({
  description: "Solve or evaluate a mathematical expression.",
  parameters: z.object({
    expression: z
      .string()
      .describe('The math expression to evaluate, e.g., "sqrt(16) + 4"'),
  }),
  async execute({ expression }) {
    try {
      const result = evaluate(expression);
      return { result: result.toString() };
    } catch (error) {
      console.log({ error });
      return { error: "Invalid math expression" };
    }
  },
});
