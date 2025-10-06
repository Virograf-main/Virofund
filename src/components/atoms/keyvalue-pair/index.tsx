import React from 'react'
import { cn } from '@/lib/utils'

type KeyValueProps = {
    label: string
    value: string
    backgroundColour: string
    dotColour: string
    job: string
}

const isTailwindBg = (val?: string) => typeof val === 'string' && val.trim().startsWith('bg');

const KeyValue = ({props}: {props: KeyValueProps}) => {
    const isJob = Boolean(props.job)

    const wrapperClass = cn(
        "flex gap-1 items-center p-1 rounded-full",
        isTailwindBg(props.backgroundColour) ? props.backgroundColour : undefined
    );
    const wrapperStyle = isTailwindBg(props.backgroundColour)
        ? undefined
        : { backgroundColor: props.backgroundColour } as React.CSSProperties;

    const dotClass = cn(
        "rounded-full w-2 h-2",
        isTailwindBg(props.dotColour) ? props.dotColour : undefined
    );
    const dotStyle = isTailwindBg(props.dotColour)
        ? undefined
        : { backgroundColor: props.dotColour } as React.CSSProperties;

  return (
    <div className='flex flex-col gap-1'>
        <p className='text-[8px] text-muted-foreground'>{props.label}:</p>
        { isJob 
        ? (<p className='text-[10px] font-medium'>{props.job}</p>) 
        : (
        <div className={wrapperClass} style={wrapperStyle}>
            <div className={dotClass} style={dotStyle}></div>
            <p className='text-[10px] font-medium'>{props.value}</p>
        </div>
        )
        }
    </div>
  )
}

export default KeyValue
