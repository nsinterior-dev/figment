import { GoogleGenerativeAI } from "@google/generative-ai"
import { buildPrompt } from "@/features/generation/utils/prompts"

const apiKey = process.env.GOOGLE_AI_API_KEY
if (!apiKey) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(apiKey)

// gemini-2.0-flash: Free tier, fast, good for code generation
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

/**
 * Generate React code from a design screenshot
 * @param image - Base64 encoded image data
 * @param prompt - Optional additional instructions
 * @returns Generated React/TypeScript code
 */
export async function generateCodeFromImage(
  image: string,
  prompt?: string
): Promise<string> {


  const fullPrompt = buildPrompt(prompt);

  // Prepare image for Gemini API
  const imagePart = {
    inlineData: {
      data: image,
      mimeType: "image/png"
    }
  }

  // Call Gemini
  const result = await model.generateContent([fullPrompt, imagePart])

  return result.response.text()
}
