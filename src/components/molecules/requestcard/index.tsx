import Image from 'next/image'
import React from 'react'
import KeyValue from '../../atoms/keyvalue-pair'
import { Button } from '../../atoms'

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


const RequestCard = ({ props }: { props: RequestCardProps }) => {
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
        <div className='p-3 bg-background'>
            <div className='space-y-3'>
                <div className='flex gap-2 items-center'>
                    <div className='rounded-full w-5 h-5'>
                        {props.image ?
                            (<Image src={`${props.image}`} alt={`${props.alt}`} fill className='object-cover' />)
                            :
                            (<div className='w-4 h-4 rounded-full bg-muted-foreground'></div>)
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p>{props.name}</p>
                        <p>{props.email}</p>
                    </div>
                </div>
                <div className='flex'>
                    <p>{props.available}</p>
                    <p>{props.timeAvailable}</p>
                </div>
            </div>
            <p className='py-4'>{props.details}</p>
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