import KeyValue from '@/components/atoms/keyvalue-pair'
import React, { ReactNode } from 'react'

const Subcard = ({text, children, className=""}: {text: string, children: ReactNode, className?: string}) => {
  return (
    <div className='md:border border-border rounded-lg md:p-4 py-4 flex-1 bg-card hover:bg-secondary/10 hover:border-primary/20 transition-all duration-200'>
        <KeyValue label={{value: text, className: className}} >{children} </KeyValue>
    </div>
  )
}

export default Subcard