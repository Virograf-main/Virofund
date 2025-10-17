import Image from 'next/image'
import React from 'react'
import KeyValue from '../../atoms/keyvalue-pair'
import { Button } from '../../atoms'
import { Timer } from 'lucide-react'
import { MoreVerticalDots } from '../../atoms/more-vertical'
import SmallPfp from '@/components/atoms/small-pfp'

type MessageProps = {
    image?: string
    alt?: string
    name: string
    textmessage: string
    day: string
    time?: string
    handleApprove?: () => void
    handleReject?: () => void
}


export const Message = ({ props, className = '' }: { props: MessageProps, className?: string }) => {

    return (
        <div className={`p-6 bg-background font-medium ${className}`} style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            <div className='space-y-2'>
                <div className='flex justify-between'>
                    <div className='flex gap-2 items-center'>
                        <SmallPfp props={{
                            image: props.image,
                            alt: props.alt
                        }}/>
                        <div className='flex flex-col gap-'>
                            <p className=' text-[12px]'>{props.name}</p>
                            <p className=' text-[10px] text-muted-foreground'>{props.textmessage}</p>
                        </div>
                    </div>
                    <div>
                        <MoreVerticalDots className='inline-flex w-auto h-auto shrink-0 border border-muted-foreground rounded-sm p-1' iconSize={10} />
                    </div>
                </div>
                
                <div className='flex items-center gap-1  text-[10px] text-muted-foreground'>
                    <Timer size={10} className='' />
                    <p>{props.day}</p>
                    <p>{props.time}</p>
                </div>
            </div>
        </div>
    )
}
