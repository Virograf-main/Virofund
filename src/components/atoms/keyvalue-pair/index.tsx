import React, { ReactNode } from 'react'

type LabelProps = {
    value: string
    className?: string
}

const KeyValue = ({label, className="", children}: {label: LabelProps, className?: string, children: ReactNode}) => {
  return (
    <div className={` ${className}`} style={{ fontFamily: "var(--font-plus-jakarta-sans)"}}>
        <p className={`${label.className}`}> {label.value}</p>
        <div>{children}</div>
    </div>
  )
}

export default KeyValue
