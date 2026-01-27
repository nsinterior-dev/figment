import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GOOGLE_AI_API_KEY
if (!apiKey) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(apiKey)

// gemini-2.0-flash-exp: Free tier, fast, good for code generation
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

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
  const basePrompt = `You are an expert React developer. Analyze this design screenshot and generate a React component.

Requirements:
- Use React 19 with functional components
- Use TypeScript with proper types
- Use Tailwind CSS for styling
- Make it responsive
- Follow accessibility best practices
- Use semantic HTML

Output ONLY the code, no explanations or markdown code blocks.`

  const fullPrompt = prompt
    ? `${basePrompt}\n\nAdditional instructions: ${prompt}`
    : basePrompt

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
