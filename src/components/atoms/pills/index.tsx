import React from 'react'

const Pills = ({text, key}: {text: string, key?: number}) => {
  return (
    <div key={key} className='rounded-full border border-muted-foreground px-3 py-1 text-muted-foreground text-[10px] font-[500]'>{text}</div>
  )
}

export default Pills