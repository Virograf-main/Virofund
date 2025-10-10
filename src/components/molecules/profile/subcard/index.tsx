import KeyValue from '@/components/atoms/keyvalue-pair'
import React, { ReactNode } from 'react'

const Subcard = ({text, children, className=""}: {text: string, children: ReactNode, className?: string}) => {
  return (
    <div className='border border-muted-foreground rounded-[8px] p-[16px]'>
        <KeyValue label={{value: text}} className={`${className}`}>{children} </KeyValue>
    </div>
  )
}

export default Subcard