import { BASE_PROMPT } from "@/shared";

export function buildPrompt(message?: string): string {
    if(!message) return BASE_PROMPT;
    return `${BASE_PROMPT} ${message}`;
}