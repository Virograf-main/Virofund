import Image from 'next/image'
import React from 'react'

type SmallPfpType = {
    image?: string
    alt?: string
}

const SmallPfp = ({props, size=24}: {props?: SmallPfpType, size?: number, }) => {
    return (
        <div className={`rounded-full relative`} style={{ width: size, height: size }}>
            {props?.image ?
                (<Image src={`${props.image}`} alt={`${props.alt}`} fill className='object-cover' />)
                :
                (<div className={`rounded-full bg-muted-foreground`} style={{ width: size, height: size }}></div>)
            }
        </div>
    )
}

export default SmallPfp