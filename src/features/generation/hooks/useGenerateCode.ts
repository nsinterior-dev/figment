"use client"
import { useCallback, useState } from "react";
import { convertToFileBase64 } from "../utils/convertToFileBase64";
import { generate } from "@/lib/api/generate";

type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export function useGenerateCode() {
    const [status, setStatus] = useState<GenerationStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);

    const generateFile = useCallback(async (file: File, prompt?: string) => {
       try {
        setStatus('loading');
        setError(null);
        setCode(null);

        const base64 = await convertToFileBase64(file);

        const result = await generate(base64, prompt);

        if (!result.success) {
          throw new Error(result.error.message);
        }

        setCode(result.data.generatedCode);
        setStatus('success');
       } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setStatus('error');
       }
    }, []);

    return { status, error, code, generateFile };
}