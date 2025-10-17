import React, { ReactNode } from 'react'

export const Card = ({className, children}: {className?: string, children: ReactNode}) => {
  return (
    <div className={`bg-background md:rounded-[20px] ${className}`}>{children}</div>
  )
}
