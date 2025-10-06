import React from 'react'

type KeyValueProps = {
    label: string
    value: string
    backgroundColour: string
    dotColour: string
    job: string
}

const KeyValue = ({props}: {props: KeyValueProps}) => {
    const isJob = Boolean(props.job)
  return (
    <div className='flex flex-col gap-1'>
        <p className='text-[8px] text-muted-foreground'>{props.label}:</p>
        { isJob 
        ? (<p className='text-[10px] font-medium'>{props.job}</p>) 
        : (<div 
            className="flex gap-1 items-center p-2 rounded-[12px]" 
            style={{ backgroundColor: props.backgroundColour }}>
            <div 
                className="rounded-full w-2 h-2"
                style={{ backgroundColor: props.backgroundColour }}></div>
            <p className='text-[10px] font-medium'>{props.value}</p>
        </div>)
        }
    </div>
  )
}

export default KeyValue