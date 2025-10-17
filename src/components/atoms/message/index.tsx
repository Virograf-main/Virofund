import Image from 'next/image'
import React, { ReactNode } from 'react'
import KeyValue from '../../atoms/keyvalue-pair'
import { Button } from '../../atoms'
import { Star, Timer } from 'lucide-react'
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


export const Message = ({ props, className = '', children }: { props: MessageProps, className?: string, children: ReactNode }) => {

    return (
        <div className={`p-6 bg-background font-medium ${className}`} style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}>
            <div className='space-y-2'>
                <div className='flex justify-between'>
                    <div className='flex gap-2 ites-center'>
                        <div className=''>
                            <SmallPfp props={{
                                image: props.image,
                                alt: props.alt
                            }} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>
                            <p className=' text-[12px] font-bold'>{props.name}</p>
                            <p className=' text-[10px] font-[500]'>{props.textmessage}</p>
                            </div>
                            
                        <div className='flex items-center gap-1  text-[10px] text-ring'>
                            <Timer size={10} className='' />
                            <p className=' '>{props.day}</p>
                            <p>{props.time}</p>
                        </div>
                        </div>


                    </div>
                    <div>
                        {/* <Star className='inline-flex w-auto h-auto shrink-0 text-primary p-1' size={16} /> */}
                        {children}
                    </div>
                </div>

            </div>
        </div>
    )
}
