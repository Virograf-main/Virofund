import Image from 'next/image'
import React from 'react'

type SmallPfpType = {
    image?: string
    alt?: string
}

const SmallPfp = ({props}: {props: SmallPfpType}) => {
    return (
        <div className='rounded-full w-6 h-6'>
            {props.image ?
                (<Image src={`${props.image}`} alt={`${props.alt}`} fill className='object-cover' />)
                :
                (<div className='w-6 h-6 rounded-full bg-muted-foreground'></div>)
            }
        </div>
    )
}

export default SmallPfp