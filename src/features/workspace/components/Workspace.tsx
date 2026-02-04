"use client"
import React, { useState } from "react"
import { UploadZone } from "@/features/upload/components/UploadZone"
import { PromptInput, GenerationStatus } from "@/features/generation"
import { useGenerateCode } from "@/features/generation"

export function Workspace() {
    const [file, setFile] = useState<File | null>(null)
    const { generateFile, status, code, error } = useGenerateCode()

    return (
        <div className="flex flex-col gap-6">
            <UploadZone onFileReady={setFile} />
            <PromptInput
                file={file}
                onGenerate={generateFile}
                isLoading={status === 'loading'}
            />
            <GenerationStatus status={status} code={code} error={error} />
        </div>
    )
}
