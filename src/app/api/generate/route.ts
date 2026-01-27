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
        console.error(err)
        return Response.json(
            { success: false, error: { code: 500, message: "Failed to generate code" } },
            { status: 500 }
          )
    }
  }
  