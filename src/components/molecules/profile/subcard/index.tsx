import KeyValue from '@/components/atoms/keyvalue-pair'
import React, { ReactNode } from 'react'

const Subcard = ({text, children, className=""}: {text: string, children: ReactNode, className?: string}) => {
  return (
    <div className='md:border border-input rounded-[8px] md:p-[16px] py-[16px] flex-1'>
        <KeyValue label={{value: text, className: className}} >{children} </KeyValue>
    </div>
  )
}

export default Subcard