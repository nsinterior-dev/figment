"use client"
import React, { useState } from 'react'
import { Input, Panel, Button } from '@/components/ui'


interface PromptInputProps {
    file: File | null             // from upload hook
    onGenerate: (file: File, prompt?: string) => void  // from generation hook
    isLoading: boolean            // to disable button while generating
  }
  

export const PromptInput = (props: PromptInputProps) => {
    const {
        file,
        onGenerate,
        isLoading
    } = props;
    const [prompt, setPrompt] = useState('');

    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    }

    const handleGenerate = () => {
       if(file) onGenerate(file, prompt || undefined)
    }

    const hasFile = file !== null;
  return (
    <Panel>
        <Input 
            placeholder='Enter your prompt here...' 
            value={prompt} 
            onChange={handlePromptChange} 
            type='text'
            disabled={isLoading}
        />
        <Button disabled={isLoading || !hasFile} onClick={handleGenerate}>Generate</Button>
    </Panel>
  )
}
