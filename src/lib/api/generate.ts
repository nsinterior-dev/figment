import type { ApiResult } from "@/shared";

export async function generate(image: string, prompt?: string): Promise<ApiResult> {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, prompt }),
    });

    const result: ApiResult = await response.json();

    return result;
}