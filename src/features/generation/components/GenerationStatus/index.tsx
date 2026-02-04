import React from 'react'
import { Spinner, Panel, Text } from '@/components/ui';
type Status = 'idle' | 'loading' | 'success' | 'error';
// GenerationStatus receives the hook's state as props
interface GenerationStatusProps {
    status: Status
    code: string | null
    error: string | null
  }  

export const GenerationStatus = (props: GenerationStatusProps) =>  {
    const {
        status,
        code,
        error
    } = props;
    
    switch (status) {
        case 'idle':      return null
        case 'loading':   return <Spinner />
        case 'success':   return <Panel>{code}</Panel>     // actual code!
        case 'error':     return <Text color="destructive">{error}</Text>  // actual message!
    }
}
