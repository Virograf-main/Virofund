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
    <div className='flex gap-4 items-center p-4 rounded-b-[20px] border-b-2 border-b-input' style={{ fontFamily: "var(--font-plus-jakarta-sans)"}}>
        <SmallPfp props={{
            image: props.image,
            alt: props.alt
        }} className='md:w-52 md:h-52 w-24 h-24' />
        <div>
            <p className='font-bold md:text-[30px] text-[20px]'>{props.name}</p>
            <p className='font-extrabold md:text-[16px] text-[11px]'>{props.role}</p>
            <p className='font-extrabold md:text-[16px] text-[11px]'>{props.location?.state} {props.location?.country ? `, ${props.location?.country}`  : ''}</p>
            <p className='md:text-[18px] text-[12px]'>{props.socials}</p>
        </div>
    </div>
  )
}

export default BasicInfo