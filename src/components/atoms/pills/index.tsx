import React from 'react'

const Pills = ({text}: {text: string}) => {
  return (
    <div className='rounded-full border border-border px-3 py-1.5 text-foreground text-xs font-medium bg-secondary/30'>{text}</div>
  )
}

export default Pills