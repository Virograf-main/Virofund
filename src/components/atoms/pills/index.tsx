import React from 'react'

const Pills = ({text}: {text: string}) => {
  return (
    <div className='rounded-full border border-muted-foreground px-8 py-2 text-muted-foreground'>{text}</div>
  )
}

export default Pills