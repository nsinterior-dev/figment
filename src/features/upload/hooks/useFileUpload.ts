import { useState } from "react"
import { validateFile } from "../utils/validateFile"

export default function useFileUpload () {
    const [ file, setFile ] = useState<File | null>(null)
    const [ preview, setPreview ] = useState<string | null>(null)
    const [ error, setError ] = useState<string | null>(null)

    function handleFileSelect (file: File) {
        const result = validateFile(file) 

        if(result.valid && preview){
            URL.revokeObjectURL(preview)
        }

        if(result.valid){
            setFile(file)
            setPreview(URL.createObjectURL(file))
            setError(null)
        }
        else {
            setError(result.error)
        }
    }

    function clearFile () {
        setFile(null)
        setPreview(null)
    }

    return {
        file,
        preview, 
        error,
        handleFileSelect,
        clearFile
    }

}