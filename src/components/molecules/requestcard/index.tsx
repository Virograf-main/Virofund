import Image from 'next/image'
import React from 'react'
import KeyValue from '../../atoms/keyvalue-pair'
import { Button } from '../../atoms'
import { Timer } from 'lucide-react'

type RequestCardProps = {
    image?: string
    alt?: string
    name: string
    email: string
    available: string
    timeAvailable?: string
    details: string
    keyValue: {
        department: string
        role: string
        backgroundColour: string
        dotColour: string
    }
}


const RequestCard = ({ props, className='' }: { props: RequestCardProps, className?: string }) => {
    const titles = [
        {
            title: "Department",
            content: props.keyValue.department
        },
        {
            title: "Job Title",
            content: props.keyValue.role
        }]

    return (
        <div className={`p-3 bg-background font-medium ${className}`} style={{fontFamily: "var(--font-plus-jakarta-sans)"}}>
            <div className='space-y-2'>
                <div className='flex gap-3 items-center'>
                    <div className='rounded-full w-5 h-5'>
                        {props.image ?
                            (<Image src={`${props.image}`} alt={`${props.alt}`} fill className='object-cover' />)
                            :
                            (<div className='w-6 h-6 rounded-full bg-muted-foreground'></div>)
                        }
                    </div>
                    <div className='flex flex-col gap-'>
                        <p className=' text-[12px]'>{props.name}</p>
                        <p className=' text-[10px] text-muted-foreground'>{props.email}</p>
                    </div>
                </div>
                <div className='flex items-center gap-1  text-[10px] text-muted-foreground'>
                    <p>{props.available}</p>
                    { props.timeAvailable && (
                        <Timer size={10} className=''/>
                    )}
                    <p>{props.timeAvailable}</p>
                </div>
            </div>
            <p className='py-2  text-[10px]'>{props.details}</p>
            <div className='flex gap-4'>
                {titles.map((value, idx) => {
                    return (
                        <div key={idx}>
                            <KeyValue props={{
                                label: value.title,
                                value: value.content,
                                backgroundColour: props.keyValue.backgroundColour,
                                dotColour: props.keyValue.dotColour,
                                job: props.keyValue.role
                            }} />
                        </div>
                    )
                })}
            </div>
            <div className='flex gap-2 justify-between'>
                <Button className='flex-1 bg-transparent border border-[#10B981]' />
                <Button className='flex-1 bg-transparent border border-[#B91C1C]' />
            </div>
        </div>
    )
}

export default RequestCard