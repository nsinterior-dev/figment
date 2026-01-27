// What fields does the request need?
export interface GenerateRequest {
  image: string,
  prompt?: string,
}

// What does success look like?
interface GenerateResponse {
  generatedCode: string,
}

// What does an error look like?
interface ApiError {
  code: number, 
  message: string
}


export type ApiResult = {success: true, data: GenerateResponse} | { success: false, error: ApiError}