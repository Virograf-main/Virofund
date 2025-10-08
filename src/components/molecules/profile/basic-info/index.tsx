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
    <div className='flex gap-4 items-center' style={{ fontFamily: "var(--font-plus-jakarta-sans)"}}>
        <SmallPfp props={{
            image: props.image,
            alt: props.alt
        }} className='w-8 h-8 sm:w-12 sm:h-12' />
        <div>
            <p className='font-bold text-[30px]'>{props.name}</p>
            <p className='font-extrabold text-[16px]'>{props.role}</p>
            <p className='font-extrabold text-[16px]'>{props.location?.state} {props.location?.country ? `, ${props.location?.country}`  : ''}</p>
            <p className='text-[18px]'>{props.socials}</p>
        </div>
    </div>
  )
}

export default BasicInfo