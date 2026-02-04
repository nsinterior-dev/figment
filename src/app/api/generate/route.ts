import { generateCodeFromImage } from "@/lib/gemini"

export async function POST(request: Request) {
    try {
        const body = await request.json()
         // Validate input FIRST
        if (!body.image) {
            return Response.json(
            { success: false, error: { code: 400, message: "Image is required" } },
            { status: 400 }
            )
        }
        const result = await generateCodeFromImage(body.image, body.prompt)
        return Response.json({ success: true, data: { generatedCode: result } })
    } catch (err){
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("Generate API Error:", errorMessage, err)
        return Response.json(
            { success: false, error: { code: 500, message: errorMessage } },
            { status: 500 }
          )
    }
  }
  