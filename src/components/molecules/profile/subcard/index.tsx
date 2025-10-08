import KeyValue from '@/components/atoms/keyvalue-pair'
import React, { ReactNode } from 'react'

const Subcard = ({text, children}: {text: string, children: ReactNode}) => {
  return (
    <div className='border border-muted-foreground rounded-[8px] p-[16px]'>
        <KeyValue label={{value: text}}>{children} </KeyValue>
    </div>
  )
}

export default Subcard