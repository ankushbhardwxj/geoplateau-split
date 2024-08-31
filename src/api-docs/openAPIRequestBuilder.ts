import { z } from "zod";

export function createApiRequest(zodSchema: z.ZodTypeAny) {
  return {
    body: {
      content: {
        "application/json": {
          schema: zodSchema
        }
      }
    }
  }
}