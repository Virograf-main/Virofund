import SmallPfp from '@/components/atoms/small-pfp'
import React from 'react'

type BasicInfoProps = {
    name: string
    role: string
    image?: string
    alt?: string
    location?: {
        state?: string
        country?: string
    }
    socials?: string
}

const BasicInfo = ({props}: {props: BasicInfoProps}) => {
  return (
    <div className='flex gap-5 items-center p-5 rounded-b-2xl border-b-2 border-b-input'>
        <SmallPfp props={{
            image: props.image,
            alt: props.alt
        }} className='md:w-48 md:h-48 w-24 h-24' />
        <div className='space-y-1.5'>
            <p className='font-bold text-xl md:text-3xl text-foreground'>{props.name}</p>
            <p className='font-semibold text-sm md:text-base text-muted-foreground'>{props.role}</p>
            <p className='text-sm md:text-base text-muted-foreground'>{props.location?.state}{props.location?.country ? `, ${props.location?.country}` : ''}</p>
            <p className='text-xs md:text-sm text-muted-foreground break-all'>{props.socials}</p>
        </div>
    </div>
  )
}

export default BasicInfo